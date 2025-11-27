'use client'

import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  category: string
  stock: number
}

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string, quantity?: number) => Promise<void>
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = async () => {
    try {
      await onAddToCart(product.id, 1)
    } catch (error) {
      // Error is already handled in the CartProvider
    }
  }

  const isOutOfStock = product.stock === 0

  return (
    <div className="card group">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* Stock Status */}
        <div className="absolute top-2 right-2">
          {isOutOfStock ? (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          ) : product.stock < 5 ? (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              Low Stock
            </span>
          ) : null}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            {product.stock} in stock
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'btn-primary hover:bg-primary-700'
          }`}
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}