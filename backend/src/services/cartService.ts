import { prisma } from '../config/database'
import { Cart, CartItem } from '../types'
import { createError } from '../middleware/errorHandler'

export class CartService {
  static async getCart(userId: string): Promise<Cart | null> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return cart
  }

  static async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true }
    })

    if (!product) {
      throw createError('Product not found', 404)
    }

    if (product.stock < quantity) {
      throw createError('Insufficient stock', 400)
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
    }

    // Return updated cart
    return await this.getCart(userId) as Cart
  }

  static async updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    })

    if (!cart) {
      throw createError('Cart not found', 404)
    }

    if (quantity <= 0) {
      // Remove item from cart
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId
        }
      })
    } else {
      // Check stock availability
      const product = await prisma.product.findUnique({
        where: { id: productId, isActive: true }
      })

      if (!product) {
        throw createError('Product not found', 404)
      }

      if (product.stock < quantity) {
        throw createError('Insufficient stock', 400)
      }

      // Update or create cart item
      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId
          }
        },
        update: { quantity },
        create: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
    }

    return await this.getCart(userId) as Cart
  }

  static async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    })

    if (!cart) {
      throw createError('Cart not found', 404)
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId
      }
    })

    return await this.getCart(userId) as Cart
  }

  static async clearCart(userId: string): Promise<void> {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    }
  }

  static async getCartTotal(userId: string): Promise<number> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart) return 0

    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  }

  static async validateCartStock(userId: string): Promise<{ valid: boolean; invalidItems: string[] }> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart) return { valid: true, invalidItems: [] }

    const invalidItems: string[] = []

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        invalidItems.push(item.product.name)
      }
    }

    return {
      valid: invalidItems.length === 0,
      invalidItems
    }
  }
}

