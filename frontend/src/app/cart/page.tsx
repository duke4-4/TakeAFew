'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'

export default function CartPage() {
  const { cart, cartItemsCount, cartTotal, updateCartItem, removeFromCart, clearCart, loading } = useCart()
  const { user } = useAuth()

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateCartItem(productId, newQuantity)
  }

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId)
  }

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart()
    }
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-4">Please log in to view your cart.</p>
          <Link href="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-800 font-medium"
          disabled={loading}
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
                {/* Product Image */}
                <div className="relative h-20 w-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.imageUrl ? (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-600">${item.product.price.toFixed(2)} each</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    disabled={loading || item.quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>

                  <span className="w-8 text-center">{item.quantity}</span>

                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    disabled={loading || item.quantity >= item.product.stock}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="text-red-600 hover:text-red-800 p-1"
                  disabled={loading}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Items ({cartItemsCount}):</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full btn-primary text-center block mt-6"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="w-full btn-secondary text-center block mt-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}