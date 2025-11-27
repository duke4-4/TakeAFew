import { Request, Response, NextFunction } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { OrderService } from '../services/orderService'
import { createError } from '../middleware/errorHandler'

export const createOrder = [
  body('shippingAddress.name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('shippingAddress.email').isEmail().withMessage('Valid email is required'),
  body('shippingAddress.address').trim().isLength({ min: 1 }).withMessage('Address is required'),
  body('shippingAddress.city').trim().isLength({ min: 1 }).withMessage('City is required'),
  body('shippingAddress.state').trim().isLength({ min: 1 }).withMessage('State is required'),
  body('shippingAddress.zipCode').trim().isLength({ min: 1 }).withMessage('Zip code is required'),
  body('shippingAddress.country').trim().isLength({ min: 1 }).withMessage('Country is required'),
  body('paymentMethodId').trim().isLength({ min: 1 }).withMessage('Payment method is required'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      if (!req.user) {
        throw createError('User not authenticated', 401)
      }

      const orderData = req.body
      const order = await OrderService.createOrder(req.user.id, orderData)

      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401)
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const result = await OrderService.getUserOrders(req.user.id, page, limit)

    res.json({
      success: true,
      data: result.orders,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

export const getOrder = [
  param('id').isUUID().withMessage('Invalid order ID'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      if (!req.user) {
        throw createError('User not authenticated', 401)
      }

      const { id } = req.params
      const order = await OrderService.getOrderById(id, req.user.id)

      res.json({
        success: true,
        data: order
      })
    } catch (error) {
      next(error)
    }
  }
]

export const updateOrderStatus = [
  param('id').isUUID().withMessage('Invalid order ID'),
  body('status').isIn(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).withMessage('Invalid status'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      const { id } = req.params
      const { status } = req.body

      const order = await OrderService.updateOrderStatus(id, status)

      res.json({
        success: true,
        data: order,
        message: 'Order status updated successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const status = req.query.status as any

    const result = await OrderService.getAllOrders(page, limit, status)

    res.json({
      success: true,
      data: result.orders,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

export const confirmPayment = [
  body('orderId').isUUID().withMessage('Invalid order ID'),
  body('paymentIntentId').trim().isLength({ min: 1 }).withMessage('Payment intent ID is required'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      const { orderId, paymentIntentId } = req.body

      await OrderService.confirmPayment(orderId, paymentIntentId)

      res.json({
        success: true,
        message: 'Payment confirmed successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

