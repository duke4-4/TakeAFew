import { prisma } from '../config/database'
import { Order, CreateOrderRequest, OrderStatus } from '../types'
import { CartService } from './cartService'
import { createError } from '../middleware/errorHandler'
import { emailService } from './emailService'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

export class OrderService {
  static async createOrder(userId: string, orderData: CreateOrderRequest): Promise<Order> {
    // Get user's cart
    const cart = await CartService.getCart(userId)
    if (!cart || cart.items.length === 0) {
      throw createError('Cart is empty', 400)
    }

    // Validate cart stock
    const stockValidation = await CartService.validateCartStock(userId)
    if (!stockValidation.valid) {
      throw createError(`Insufficient stock for: ${stockValidation.invalidItems.join(', ')}`, 400)
    }

    // Calculate total amount
    const totalAmount = await CartService.getCartTotal(userId)

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId,
        integration_check: 'accept_a_payment'
      }
    })

    // Create order in database
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddress: orderData.shippingAddress,
          paymentIntentId: paymentIntent.id,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })

      // Update product stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      // Clear the cart
      await CartService.clearCart(userId)

      return newOrder
    })

    // Send order confirmation email
    try {
      await emailService.sendOrderConfirmation(order)
    } catch (error) {
      console.error('Failed to send order confirmation email:', error)
    }

    return order
  }

  static async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }),
      prisma.order.count({ where: { userId } })
    ])

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  static async getOrderById(orderId: string, userId?: string): Promise<Order> {
    const where: any = { id: orderId }
    if (userId) {
      where.userId = userId // Regular users can only see their own orders
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!order) {
      throw createError('Order not found', 404)
    }

    return order
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      throw createError('Order not found', 404)
    }

    // Validate status transition
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [],
      CANCELLED: []
    }

    if (!validTransitions[order.status].includes(status)) {
      throw createError(`Cannot change status from ${order.status} to ${status}`, 400)
    }

    // If cancelling, restore stock
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      await this.restoreOrderStock(orderId)
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Send status update email
    try {
      await emailService.sendOrderStatusUpdate(updatedOrder, order.status, status)
    } catch (error) {
      console.error('Failed to send order status update email:', error)
    }

    return updatedOrder
  }

  static async restoreOrderStock(orderId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    })

    if (!order) return

    // Restore stock for each item
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      })
    }
  }

  static async getAllOrders(page: number = 1, limit: number = 10, status?: OrderStatus) {
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ])

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  static async confirmPayment(orderId: string, paymentIntentId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      throw createError('Order not found', 404)
    }

    if (order.paymentIntentId !== paymentIntentId) {
      throw createError('Payment intent mismatch', 400)
    }

    // Update order status to processing
    await this.updateOrderStatus(orderId, 'PROCESSING')
  }
}
