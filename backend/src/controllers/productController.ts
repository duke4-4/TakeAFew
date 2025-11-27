import { Request, Response, NextFunction } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { ProductService } from '../services/productService'
import { createError } from '../middleware/errorHandler'

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const category = req.query.category as string
    const search = req.query.search as string
    const sortBy = req.query.sortBy as string || 'createdAt'
    const sortOrder = (req.query.sortOrder as string === 'asc') ? 'asc' : 'desc'

    const result = await ProductService.getAllProducts(page, limit, category, search, sortBy, sortOrder)

    res.json({
      success: true,
      data: result.products,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

export const getProduct = [
  param('id').isUUID().withMessage('Invalid product ID'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      const { id } = req.params
      const product = await ProductService.getProductById(id)

      res.json({
        success: true,
        data: product
      })
    } catch (error) {
      next(error)
    }
  }
]

export const createProduct = [
  // Validation middleware
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('imageUrl').optional().isURL().withMessage('Image URL must be valid'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      const productData = req.body
      const product = await ProductService.createProduct(productData)

      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

export const updateProduct = [
  param('id').isUUID().withMessage('Invalid product ID'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      const { id } = req.params
      const updateData = req.body

      const product = await ProductService.updateProduct(id, updateData)

      res.json({
        success: true,
        data: product,
        message: 'Product updated successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

export const deleteProduct = [
  param('id').isUUID().withMessage('Invalid product ID'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      const { id } = req.params
      await ProductService.deleteProduct(id)

      res.json({
        success: true,
        message: 'Product deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await ProductService.getCategories()

    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    next(error)
  }
}

export const updateStock = [
  param('id').isUUID().withMessage('Invalid product ID'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400)
      }

      const { id } = req.params
      const { stock } = req.body

      const product = await ProductService.updateStock(id, stock)

      res.json({
        success: true,
        data: product,
        message: 'Stock updated successfully'
      })
    } catch (error) {
      next(error)
    }
  }
]

