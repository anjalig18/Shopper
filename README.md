# 🛒 ShopHub E-commerce Platform

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application with admin dashboard, cart management, order processing, and Razorpay payment integration.

![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-ISC-blue)

## ✨ Features

### Customer Features
- 🔐 User authentication (Register/Login with JWT)
- 🛍️ Product browsing and search
- 🛒 Shopping cart management
- 📦 Order placement and tracking
- 💳 Multiple payment options (Razorpay, Cash on Delivery)
- 📱 Responsive design for mobile and desktop
- ⭐ Product ratings and reviews
- 🔔 Order status notifications

### Admin Features
- 👥 User management (CRUD operations)
- 📦 Product management (Add, Edit, Delete)
- 📊 Dashboard with analytics
- 📋 Order management and status updates
- 💰 Revenue tracking
- 📈 Sales statistics

## 🏗️ Tech Stack

### Frontend
- **React** 18.2 - UI library
- **React Router** 6.30 - Client-side routing
- **Lucide React** - Icon library
- **Tailwind CSS** - Styling (via PostCSS)

### Backend
- **Node.js** - Runtime environment
- **Express** 5.1 - Web framework
- **MongoDB** - Database
- **Mongoose** 8.16 - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Razorpay** - Payment gateway

## 📋 Prerequisites

- Node.js 16+ and npm 8+
- MongoDB Atlas account (free tier available)
- Razorpay account (for payment integration)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd shophub-ecommerce
```

### 2. Install Dependencies
```bash
npm run install-all
```

This installs dependencies for root, client, and server.

### 3. Configure Environment Variables

**Server Configuration** (`server/.env`):
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shophub?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

**Client Configuration** (`client/.env`):
```bash
cp client/.env.example client/.env
```

Edit `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run the Application

**Development Mode** (runs both frontend and backend):
```bash
npm run dev
```

**Or run separately:**

Backend only:
```bash
npm run server
```

Frontend only:
```bash
npm run client
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### 6. Default Admin Credentials

```
Email: admin@example.com
Password: admin123
```

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

## 📁 Project Structure

```
shophub-ecommerce/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── package.json
│   └── .env
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── index.js         # Server entry point
│   ├── package.json
│   └── .env
├── .gitignore
├── package.json          # Root package.json
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose config
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin` - Admin login
- `PUT /api/auth/profile` - Update profile
- `GET /api/auth/profile` - Get profile by email

### Products
- `GET /api/products` - Get all products (with search)
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove from cart

### Orders
- `POST /api/orders/place` - Place new order
- `GET /api/orders/my` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order
- `DELETE /api/orders/:id/cancelled` - Delete cancelled order
- `DELETE /api/orders/all` - Delete all user orders
- `GET /api/orders/all` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in with email and password
2. Server validates credentials and returns JWT token
3. Client stores token and includes it in subsequent requests
4. Server validates token on protected routes

**Protected Routes**: All cart, order, payment, and admin routes require authentication.

## 🗄️ Database Models

### User
- name, email, password (hashed)
- role (user/admin/moderator)
- status (active/inactive/suspended)
- profile information
- timestamps

### Product
- name, description, price
- category, stock
- images, rating
- status, tags
- timestamps

### Cart
- user reference
- items (product, quantity)
- timestamps

### Order
- user reference
- items (product, quantity, price)
- totalAmount, address
- paymentMethod, paymentStatus
- orderStatus, deliveryDate
- orderNumber
- timestamps

## 🐳 Docker Deployment

### Using Docker Compose
```bash
docker-compose up -d
```

### Using Dockerfile
```bash
docker build -t shophub-ecommerce .
docker run -p 5000:5000 \
  -e MONGO_URI=<your-uri> \
  -e JWT_SECRET=<your-secret> \
  shophub-ecommerce
```

## 🌐 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Render.com
- Railway.app
- Vercel + Render
- Docker on VPS
- Heroku

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Authentication
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

## 🔧 Development Scripts

```bash
npm run dev          # Run both client and server
npm run client       # Run frontend only
npm run server       # Run backend only
npm run install-all  # Install all dependencies
npm run build        # Build frontend for production
```

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Environment-based configuration
- Input validation
- Protected admin routes
- Secure payment integration

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**CORS Error**
- Check `CORS_ORIGIN` in server/.env
- Ensure frontend URL matches exactly
- Verify no trailing slashes

**Authentication Not Working**
- Verify JWT_SECRET is set
- Check token format in Authorization header
- Ensure user exists and is active

**Port Already in Use**
- Change PORT in server/.env
- Kill process using the port: `lsof -ti:5000 | xargs kill`

## 📝 Environment Variables

### Required Server Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT (min 32 chars)
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key

### Optional Server Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed origins for CORS
- `CLIENT_URL` - Frontend URL

### Required Client Variables
- `REACT_APP_API_URL` - Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Razorpay for payment integration
- React team for the amazing framework
- Express.js community

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Made with ❤️ using MERN Stack**
# Shopper
