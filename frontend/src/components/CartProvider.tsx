'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthProvider'
import toast from 'react-hot-toast'

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    imageUrl?: string
  }
}

interface CartContextType {
  cart: CartItem[]
  cartItemsCount: number
  cartTotal: number
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateCartItem: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  const refreshCart = async () => {
    if (!user) {
      setCart([])
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setCart(data.data.items || [])
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item to cart')
      }

      setCart(data.data.items || [])
      toast.success('Item added to cart!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add item to cart')
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (productId: string, quantity: number) => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/items/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update cart item')
      }

      setCart(data.data.items || [])
      toast.success('Cart updated!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update cart item')
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/items/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove item from cart')
      }

      setCart(data.data.items || [])
      toast.success('Item removed from cart!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove item from cart')
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to clear cart')
      }

      setCart([])
      toast.success('Cart cleared!')
    } catch (error) {
      toast.error('Failed to clear cart')
    } finally {
      setLoading(false)
    }
  }

  // Refresh cart when user changes
  useEffect(() => {
    refreshCart()
  }, [user])

  const value = {
    cart,
    cartItemsCount,
    cartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    loading
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

