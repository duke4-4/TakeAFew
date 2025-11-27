'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { cart, cartTotal, updateCartItem, removeFromCart, clearCart, loading } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await updateCartItem(productId, newQuantity)
    } catch (error) {
      // Error is handled in the CartProvider
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId)
    } catch (error) {
      // Error is handled in the CartProvider
    }
  }

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart()
      } catch (error) {
        // Error is handled in the CartProvider
      }
    }
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout')
      router.push('/login?redirect=/checkout')
      return
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    router.push('/checkout')
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          disabled={loading}
          className="text-red-600 hover:text-red-700 font-medium text-sm"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="card p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 7v10h16V7H4zm8 2l5 3H7l5-3z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="hover:text-primary-600"
                      >
                        {item.product.name}
                      </Link>
                    </h3>

                    <p className="text-gray-600 text-sm mb-2">
                      ${item.product.price.toFixed(2)} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={loading}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-2 text-center min-w-12">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={loading}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full btn-primary py-3 text-lg"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/products"
              className="block text-center mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
