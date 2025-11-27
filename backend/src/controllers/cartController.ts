import { Request, Response, NextFunction } from 'express'
import { body, param, validationResult } from 'express-validator'
import { CartService } from '../services/cartService'
import { createError } from '../middleware/errorHandler'

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401)
    }

    const cart = await CartService.getCart(req.user.id)

    res.json({
      success: true,
      data: cart || { items: [] }
    })
  } catch (error) {
    next(error)
  }
}

export const addToCart = [
  body('productId').isUUID().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      if (!req.user) {
        throw createError('User not authenticated', 401)
      }

      const { productId, quantity } = req.body

      const cart = await CartService.addToCart(req.user.id, productId, quantity)

      res.json({
        success: true,
        data: cart,
        message: 'Item added to cart successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

export const updateCartItem = [
  param('productId').isUUID().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be non-negative'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      if (!req.user) {
        throw createError('User not authenticated', 401)
      }

      const { productId } = req.params
      const { quantity } = req.body

      const cart = await CartService.updateCartItem(req.user.id, productId, quantity)

      res.json({
        success: true,
        data: cart,
        message: 'Cart updated successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

export const removeFromCart = [
  param('productId').isUUID().withMessage('Invalid product ID'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      if (!req.user) {
        throw createError('User not authenticated', 401)
      }

      const { productId } = req.params

      const cart = await CartService.removeFromCart(req.user.id, productId)

      res.json({
        success: true,
        data: cart,
        message: 'Item removed from cart successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401)
    }

    await CartService.clearCart(req.user.id)

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const getCartTotal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401)
    }

    const total = await CartService.getCartTotal(req.user.id)

    res.json({
      success: true,
      data: { total }
    })
  } catch (error) {
    next(error)
  }
}

