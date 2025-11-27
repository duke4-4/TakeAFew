import { Router } from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  updateStock
} from '../controllers/productController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Public routes
router.get('/', getProducts)
router.get('/categories', getCategories)
router.get('/:id', getProduct)

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), createProduct)
router.put('/:id', authenticate, authorize('ADMIN'), updateProduct)
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct)
router.patch('/:id/stock', authenticate, authorize('ADMIN'), updateStock)

export default router

