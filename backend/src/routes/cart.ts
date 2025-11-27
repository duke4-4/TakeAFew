import { Router } from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartTotal
} from '../controllers/cartController'
import { authenticate } from '../middleware/auth'

const router = Router()

// All cart routes require authentication
router.use(authenticate)

router.get('/', getCart)
router.get('/total', getCartTotal)
router.post('/items', addToCart)
router.put('/items/:productId', updateCartItem)
router.delete('/items/:productId', removeFromCart)
router.delete('/', clearCart)

export default router

