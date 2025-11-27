# E-Commerce Platform

A full-stack e-commerce platform built with Next.js (frontend) and Node.js/Express (backend) with Prisma ORM and Neon PostgreSQL database.

## Features

### Frontend
- ✅ Product catalog with filtering, sorting, and search
- ✅ Shopping cart functionality
- ✅ User authentication (registration/login)
- ✅ Responsive design with Tailwind CSS

### Backend
- ✅ RESTful API with Express.js
- ✅ JWT authentication and authorization
- ✅ Product management (CRUD operations)
- ✅ Order management with status tracking
- ✅ Inventory management with automatic stock updates
- ✅ Payment integration (Stripe sandbox)
- ✅ Email notifications for orders
- ✅ Input validation and security middleware

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Hook Form
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL (Neon serverless)
- **Authentication**: JWT (JSON Web Tokens)
- **Payments**: Stripe (sandbox mode)
- **Email**: Nodemailer
- **Deployment**: Docker (optional)

## Project Structure

```
TakeAFew/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # Next.js app router pages
│   │   ├── components/# React components
│   │   └── lib/       # Utility functions
│   └── package.json
├── backend/           # Express.js API
│   ├── src/
│   │   ├── controllers/# Route controllers
│   │   ├── middleware/# Custom middleware
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic
│   │   └── config/    # Database and config
│   ├── prisma/        # Database schema and migrations
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (we recommend [Neon](https://neon.tech) for serverless PostgreSQL)
- Stripe account (for payments - sandbox mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TakeAFew
   ```

2. **Set up the backend**

   ```bash
   cd backend

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration (see Environment Variables section)
   ```

3. **Set up the frontend**

   ```bash
   cd ../frontend

   # Install dependencies
   npm install

   # Set up environment variables
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
   ```

### Database Setup

1. **Create a Neon PostgreSQL database** at [neon.tech](https://neon.tech)

2. **Update the DATABASE_URL in backend/.env** with your Neon connection string:
   ```
   DATABASE_URL="postgresql://username:password@hostname/database"
   ```

3. **Run database migrations**:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@hostname/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Email (optional - for order notifications)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="noreply@yourapp.com"

# Payment (Stripe)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# App
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

## Running the Application

### Development Mode

1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

### Production Build

1. **Build the backend**:
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   npm start
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/change-password` - Change password

### Product Endpoints

- `GET /api/products` - Get all products (with filtering/pagination)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/categories` - Get all categories

### Cart Endpoints

- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update cart item quantity
- `DELETE /api/cart/items/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Order Endpoints

- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Docker Deployment (Optional)

### Build and run with Docker Compose

1. **Create docker-compose.yml** in the root directory:
   ```yaml
   version: '3.8'
   services:
     db:
       image: postgres:15
       environment:
         POSTGRES_DB: ecommerce
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
       volumes:
         - postgres_data:/var/lib/postgresql/data

     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         DATABASE_URL: postgresql://postgres:password@db:5432/ecommerce
       depends_on:
         - db

     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       depends_on:
         - backend
   volumes:
     postgres_data:
   ```

2. **Build and run**:
   ```bash
   docker-compose up --build
   ```

## User Guide

### For Customers

1. **Browse Products**: Visit the products page to browse, search, and filter products
2. **Add to Cart**: Click "Add to Cart" on any product
3. **Checkout**: Review your cart and proceed to checkout
4. **Payment**: Enter shipping information and payment details (Stripe test card: 4242 4242 4242 4242)
5. **Order Tracking**: View your orders in the "My Orders" section

### For Administrators

1. **Login** with admin credentials
2. **Manage Products**: Add, edit, or delete products
3. **Manage Orders**: View and update order status
4. **Inventory**: Monitor stock levels and update as needed

## Stripe Test Cards

Use these test card numbers for testing payments:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Require Authentication**: 4000 0025 0000 3155

Use any future expiry date and any CVC.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.