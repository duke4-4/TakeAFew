import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import { AuthService } from '../services/authService'
import { createError } from '../middleware/errorHandler'

export const register = [
  // Validation middleware
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      const { name, email, password } = req.body

      const { user, token } = await AuthService.register(name, email, password)

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      res.status(201).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        },
        message: 'User registered successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

export const login = [
  // Validation middleware
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      const { email, password } = req.body

      const { user, token } = await AuthService.login(email, password)

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      res.json({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        },
        message: 'Login successful'
      })
    } catch (error) {
      next(error)
    }
  }
]

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401)
    }

    const user = await AuthService.getUserById(req.user.id)

    if (!user) {
      throw createError('User not found', 404)
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      data: userWithoutPassword
    })
  } catch (error) {
    next(error)
  }
}

export const changePassword = [
  // Validation middleware
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      if (!req.user) {
        throw createError('User not authenticated', 401)
      }

      const { currentPassword, newPassword } = req.body

      await AuthService.changePassword(req.user.id, currentPassword, newPassword)

      res.json({
        success: true,
        message: 'Password changed successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

