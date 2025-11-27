import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eshop.com' },
    update: {},
    create: {
      email: 'admin@eshop.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@eshop.com' },
    update: {},
    create: {
      email: 'user@eshop.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER'
    }
  })

  // Create sample products
  const products = [
    {
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
      price: 199.99,
      category: 'Electronics',
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
    },
    {
      name: 'Smart Watch Series 5',
      description: 'Advanced smartwatch with health monitoring, GPS, and cellular connectivity.',
      price: 399.99,
      category: 'Electronics',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
    },
    {
      name: 'Ergonomic Office Chair',
      description: 'Comfortable office chair with lumbar support and adjustable height.',
      price: 249.99,
      category: 'Furniture',
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500'
    },
    {
      name: 'Coffee Maker Deluxe',
      description: 'Programmable coffee maker with thermal carafe and built-in grinder.',
      price: 129.99,
      category: 'Appliances',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500'
    },
    {
      name: 'Yoga Mat Premium',
      description: 'Non-slip yoga mat made from natural rubber with carrying strap.',
      price: 49.99,
      category: 'Sports & Fitness',
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'
    },
    {
      name: 'Leather Wallet',
      description: 'Genuine leather wallet with RFID protection and multiple card slots.',
      price: 79.99,
      category: 'Accessories',
      stock: 75,
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'
    },
    {
      name: 'Wireless Charging Pad',
      description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
      price: 39.99,
      category: 'Electronics',
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500'
    },
    {
      name: 'Desk Lamp LED',
      description: 'Modern LED desk lamp with adjustable brightness and USB charging port.',
      price: 89.99,
      category: 'Furniture',
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
    }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('👤 Test Accounts:')
  console.log('Admin: admin@eshop.com / admin123')
  console.log('User: user@eshop.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
