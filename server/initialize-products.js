const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Sample products data
const SAMPLE_PRODUCTS = [
  {
    name: 'Premium Wireless Headphones',
    price: 299,
    image: '🎧',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics',
    rating: { average: 4.8, count: 124 },
    stock: 50,
    status: 'active'
  },
  {
    name: 'Smart Fitness Tracker',
    price: 199,
    image: '⌚',
    description: 'Track your fitness goals with this smart device',
    category: 'Electronics',
    rating: { average: 4.6, count: 89 },
    stock: 75,
    status: 'active'
  },
  {
    name: 'Professional Camera',
    price: 899,
    image: '📸',
    description: 'Capture stunning photos with professional quality',
    category: 'Electronics',
    rating: { average: 4.9, count: 256 },
    stock: 25,
    status: 'active'
  },
  {
    name: 'Gaming Laptop',
    price: 1299,
    image: '💻',
    description: 'High-performance laptop for gaming enthusiasts',
    category: 'Electronics',
    rating: { average: 4.7, count: 178 },
    stock: 30,
    status: 'active'
  },
  {
    name: 'Bluetooth Speaker',
    price: 149,
    image: '🔊',
    description: 'Portable speaker with excellent sound quality',
    category: 'Electronics',
    rating: { average: 4.5, count: 92 },
    stock: 100,
    status: 'active'
  },
  {
    name: 'Smart Watch',
    price: 399,
    image: '⌚',
    description: 'Stay connected with this feature-rich smartwatch',
    category: 'Electronics',
    rating: { average: 4.8, count: 203 },
    stock: 60,
    status: 'active'
  },
  {
    name: 'Elegant Red Dress',
    price: 799,
    image: '👗',
    description: 'Stylish red dress for special occasions',
    category: 'Fashion',
    rating: { average: 4.7, count: 88 },
    stock: 40,
    status: 'active'
  },
  {
    name: 'Classic Blue Jeans',
    price: 499,
    image: '👖',
    description: 'Comfortable and durable blue jeans',
    category: 'Fashion',
    rating: { average: 4.5, count: 120 },
    stock: 80,
    status: 'active'
  },
  {
    name: 'Trendy Sneakers',
    price: 599,
    image: '👟',
    description: 'Trendy sneakers for everyday wear',
    category: 'Fashion',
    rating: { average: 4.8, count: 150 },
    stock: 65,
    status: 'active'
  },
  {
    name: 'Leather Handbag',
    price: 999,
    image: '👜',
    description: 'Premium leather handbag for all occasions',
    category: 'Fashion',
    rating: { average: 4.9, count: 60 },
    stock: 35,
    status: 'active'
  },
  {
    name: 'Modern Sofa',
    price: 2999,
    image: '🛋️',
    description: 'Comfortable modern sofa for your living room',
    category: 'Home',
    rating: { average: 4.6, count: 45 },
    stock: 15,
    status: 'active'
  },
  {
    name: 'LED Table Lamp',
    price: 299,
    image: '💡',
    description: 'Energy-efficient LED table lamp',
    category: 'Home',
    rating: { average: 4.7, count: 78 },
    stock: 90,
    status: 'active'
  },
  {
    name: 'Football',
    price: 299,
    image: '⚽',
    description: 'Durable football for outdoor play',
    category: 'Sports',
    rating: { average: 4.7, count: 110 },
    stock: 120,
    status: 'active'
  },
  {
    name: 'Tennis Racket',
    price: 799,
    image: '🎾',
    description: 'Lightweight tennis racket for all levels',
    category: 'Sports',
    rating: { average: 4.6, count: 70 },
    stock: 45,
    status: 'active'
  },
  {
    name: 'Yoga Mat',
    price: 249,
    image: '🧘',
    description: 'Non-slip yoga mat for fitness routines',
    category: 'Sports',
    rating: { average: 4.8, count: 95 },
    stock: 85,
    status: 'active'
  }
];

async function initializeProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-ecommerce');
    console.log('Connected to MongoDB');

    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      console.log('No products found, creating sample products...');
      
      // Create products
      const createdProducts = await Product.insertMany(SAMPLE_PRODUCTS);
      console.log(`Successfully created ${createdProducts.length} sample products`);
      
      console.log('Sample products created:');
      createdProducts.forEach(product => {
        console.log(`- ${product.name} (${product.category}) - ₹${product.price}`);
      });
    } else {
      console.log(`Database already has ${existingProducts} products`);
      
      // Update existing products to ensure they have all required fields
      for (const productData of SAMPLE_PRODUCTS) {
        const existingProduct = await Product.findOne({ name: productData.name });
        if (existingProduct) {
          // Update with missing fields
          await Product.findByIdAndUpdate(existingProduct._id, {
            $set: {
              stock: productData.stock,
              status: productData.status,
              rating: productData.rating
            }
          });
        }
      }
      console.log('Updated existing products with missing fields');
    }
    
    console.log('Product initialization completed');
  } catch (error) {
    console.error('Error initializing products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the initialization
initializeProducts(); 