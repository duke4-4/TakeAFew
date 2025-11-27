# E-Commerce Platform

A full-stack e-commerce platform built with Next.js (frontend) and Node.js/Express (backend) with Prisma ORM and Neon PostgreSQL database.

## 🚀 Features

### Frontend (Next.js)
- ✅ Product catalog with filtering, sorting, and search
- ✅ Shopping cart functionality
- ✅ User authentication (registration/login)
- ✅ Checkout process with form validation
- ✅ Responsive design with Tailwind CSS
- ✅ Real-time cart updates

### Backend (Node.js/Express)
- ✅ RESTful API architecture
- ✅ JWT-based authentication
- ✅ Product management (CRUD operations)
- ✅ Order management and fulfillment
- ✅ Inventory management with automatic stock updates
- ✅ Payment integration (Stripe sandbox)
- ✅ Email notifications for orders
- ✅ Input validation and security middleware
- ✅ Modular architecture with separate services

### Database (Prisma + Neon PostgreSQL)
- ✅ User management with roles (USER/ADMIN)
- ✅ Product catalog with categories
- ✅ Shopping cart functionality
- ✅ Order tracking with status updates
- ✅ Inventory management

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (Neon), Prisma ORM
- **Authentication:** JWT
- **Payment:** Stripe (Sandbox)
- **Email:** Nodemailer
- **Validation:** Express Validator
- **Security:** Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Stripe account (for payments)
- Email service (Gmail or other SMTP)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Copy the environment files and update with your credentials:

   **Backend (.env)**
   ```env
   DATABASE_URL="postgresql://username:password@hostname/database"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   EMAIL_FROM="noreply@yourapp.com"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   PORT=5000
   NODE_ENV="development"
   CORS_ORIGIN="http://localhost:3000"
   ```

   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (optional)**
   ```bash
   npx prisma db seed
   ```

6. **Start the development servers**
   ```bash
   # From project root
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

## 📁 Project Structure

```
ecommerce-platform/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   └── lib/            # Utility functions
│   └── package.json
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
└── README.md
```

## 🗄️ Database Schema

### Core Models
- **User**: Customer and admin accounts
- **Product**: Product catalog with inventory
- **Cart/CartItem**: Shopping cart functionality
- **Order/OrderItem**: Order management and tracking

### Key Relationships
- User → Cart (1:1)
- User → Orders (1:many)
- Product → CartItems (1:many)
- Product → OrderItems (1:many)
- Order → OrderItems (1:many)

## 🔐 Authentication

The platform uses JWT (JSON Web Tokens) for authentication:

- **Registration/Login**: Create account or authenticate existing user
- **Protected Routes**: JWT required for cart, checkout, orders
- **Role-based Access**: Admin routes for product/order management

## 💳 Payment Integration

Integrated with Stripe for secure payment processing:

- **Sandbox Mode**: Test payments without real money
- **Order Creation**: Payment intent created during checkout
- **Webhook Support**: Payment confirmation handling

## 📧 Email Notifications

Automated email notifications for:

- Order confirmations
- Order status updates
- Payment confirmations

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests only
cd backend && npm test

# Run frontend tests only
cd frontend && npm test
```

## 🚢 Deployment

### Environment Setup
1. Set up production database (Neon PostgreSQL)
2. Configure production environment variables
3. Set up email service for production
4. Configure Stripe for production payments

### Docker Deployment (Optional)
```bash
# Build and run with Docker
docker-compose up --build
```

## 🤝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Product Endpoints
- `GET /api/products` - List products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update cart item
- `DELETE /api/cart/items/:productId` - Remove from cart

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Building
npm run build           # Build both frontend and backend
npm run build:frontend  # Build only frontend
npm run build:backend   # Build only backend

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Prisma Studio
```

## 📈 Performance Features

- Database query optimization with Prisma
- Image optimization with Next.js
- Response compression
- Rate limiting for API endpoints
- Efficient pagination for large datasets

## 🔒 Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Rate limiting to prevent abuse

## 🎯 Future Enhancements

- [ ] Real-time inventory updates
- [ ] Advanced search with Elasticsearch
- [ ] Multi-language support (i18n)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking with shipment details
- [ ] Admin dashboard with analytics
- [ ] Mobile app with React Native
- [ ] Advanced caching with Redis
- [ ] Webhook integrations
- [ ] API rate limiting per user
- [ ] Backup and recovery procedures

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, email support@yourapp.com or create an issue in the repository.

---

Built with ❤️ using Next.js, Express.js, Prisma, and Neon PostgreSQL.
