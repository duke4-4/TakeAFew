'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from './CartProvider'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
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
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, loading } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.stock <= 0) {
      toast.error('Product is out of stock')
      return
    }

    try {
      await addToCart(product.id)
    } catch (error) {
      // Error is handled in the CartProvider
    }
  }

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 7v10h16V7H4zm8 2l5 3H7l5-3z"/>
              </svg>
            </div>
          )}

          {/* Stock Status */}
          {product.stock <= 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              Out of Stock
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
              Low Stock
            </div>
          )}
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

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={loading || product.stock <= 0}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              Add to Cart
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
        </div>
      </div>
    </Link>
  )
}
