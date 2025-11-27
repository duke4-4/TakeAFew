import { prisma } from '../config/database'
import { Product, CreateProductRequest, UpdateProductRequest } from '../types'
import { createError } from '../middleware/errorHandler'

export class ProductService {
  static async getAllProducts(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const skip = (page - 1) * limit

    const where: any = {
      isActive: true
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.product.count({ where })
    ])

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  static async getProductById(id: string): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id, isActive: true }
    })

    if (!product) {
      throw createError('Product not found', 404)
    }

    return product
  }

  static async createProduct(productData: CreateProductRequest): Promise<Product> {
    return await prisma.product.create({
      data: productData
    })
  }

  static async updateProduct(id: string, productData: UpdateProductRequest): Promise<Product> {
    // Check if product exists
    await this.getProductById(id)

    return await prisma.product.update({
      where: { id },
      data: productData
    })
  }

  static async deleteProduct(id: string): Promise<void> {
    // Check if product exists
    await this.getProductById(id)

    // Soft delete - set isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    })
  }

  static async getCategories(): Promise<string[]> {
    const categories = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category']
    })

    return categories.map(c => c.category)
  }

  static async updateStock(id: string, newStock: number): Promise<Product> {
    if (newStock < 0) {
      throw createError('Stock cannot be negative', 400)
    }

    return await prisma.product.update({
      where: { id },
      data: { stock: newStock }
    })
  }

  static async checkStockAvailability(productId: string, requestedQuantity: number): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: { stock: true }
    })

    if (!product) {
      return false
    }

    return product.stock >= requestedQuantity
  }
}

