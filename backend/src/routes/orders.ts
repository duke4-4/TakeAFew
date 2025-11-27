import { Router } from 'express'
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
  confirmPayment
} from '../controllers/orderController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// User routes (authenticated users)
router.post('/', authenticate, createOrder)
router.get('/my-orders', authenticate, getUserOrders)
router.get('/:id', authenticate, getOrder)

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), getAllOrders)
router.put('/:id/status', authenticate, authorize('ADMIN'), updateOrderStatus)

// Payment confirmation (webhook endpoint)
router.post('/confirm-payment', confirmPayment)

export default router

