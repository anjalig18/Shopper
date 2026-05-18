const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
require('dotenv').config();

// Comprehensive product data for all categories
const ALL_PRODUCTS = [
  // ===== ELECTRONICS =====
  {
    name: 'Premium Wireless Headphones',
    price: 299,
    image: '🎧',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality',
    category: 'Electronics',
    rating: { average: 4.8, count: 124 },
    stock: 50,
    status: 'active'
  },
  {
    name: 'Smart Fitness Tracker',
    price: 199,
    image: '⌚',
    description: 'Track your fitness goals with heart rate monitoring and GPS',
    category: 'Electronics',
    rating: { average: 4.6, count: 89 },
    stock: 75,
    status: 'active'
  },
  {
    name: 'Professional Camera',
    price: 899,
    image: '📸',
    description: 'Capture stunning photos with professional DSLR camera',
    category: 'Electronics',
    rating: { average: 4.9, count: 256 },
    stock: 25,
    status: 'active'
  },
  {
    name: 'Gaming Laptop',
    price: 1299,
    image: '💻',
    description: 'High-performance laptop for gaming enthusiasts with RTX graphics',
    category: 'Electronics',
    rating: { average: 4.7, count: 178 },
    stock: 30,
    status: 'active'
  },
  {
    name: 'Bluetooth Speaker',
    price: 149,
    image: '🔊',
    description: 'Portable speaker with excellent sound quality and long battery life',
    category: 'Electronics',
    rating: { average: 4.5, count: 92 },
    stock: 100,
    status: 'active'
  },
  {
    name: 'Smart Watch',
    price: 399,
    image: '⌚',
    description: 'Stay connected with this feature-rich smartwatch with health monitoring',
    category: 'Electronics',
    rating: { average: 4.8, count: 203 },
    stock: 60,
    status: 'active'
  },
  {
    name: 'Wireless Earbuds',
    price: 249,
    image: '🎧',
    description: 'True wireless earbuds with active noise cancellation',
    category: 'Electronics',
    rating: { average: 4.7, count: 156 },
    stock: 80,
    status: 'active'
  },
  {
    name: 'Tablet Pro',
    price: 699,
    image: '📱',
    description: 'Professional tablet for work and entertainment',
    category: 'Electronics',
    rating: { average: 4.6, count: 98 },
    stock: 40,
    status: 'active'
  },

  // ===== FASHION =====
  {
    name: 'Elegant Red Dress',
    price: 799,
    image: '👗',
    description: 'Stylish red dress for special occasions and parties',
    category: 'Fashion',
    rating: { average: 4.7, count: 88 },
    stock: 40,
    status: 'active'
  },
  {
    name: 'Classic Blue Jeans',
    price: 499,
    image: '👖',
    description: 'Comfortable and durable blue jeans for everyday wear',
    category: 'Fashion',
    rating: { average: 4.5, count: 120 },
    stock: 80,
    status: 'active'
  },
  {
    name: 'Trendy Sneakers',
    price: 599,
    image: '👟',
    description: 'Trendy sneakers for everyday wear with comfort technology',
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
    name: 'Summer Hat',
    price: 199,
    image: '👒',
    description: 'Lightweight hat for sunny days and outdoor activities',
    category: 'Fashion',
    rating: { average: 4.3, count: 34 },
    stock: 90,
    status: 'active'
  },
  {
    name: 'Designer Sunglasses',
    price: 399,
    image: '🕶️',
    description: 'Stylish sunglasses with UV protection',
    category: 'Fashion',
    rating: { average: 4.6, count: 72 },
    stock: 55,
    status: 'active'
  },
  {
    name: 'Formal Shirt',
    price: 349,
    image: '👔',
    description: 'Professional formal shirt for office and meetings',
    category: 'Fashion',
    rating: { average: 4.4, count: 45 },
    stock: 70,
    status: 'active'
  },
  {
    name: 'Winter Jacket',
    price: 899,
    image: '🧥',
    description: 'Warm winter jacket with insulation for cold weather',
    category: 'Fashion',
    rating: { average: 4.7, count: 89 },
    stock: 30,
    status: 'active'
  },

  // ===== HOME & GARDEN =====
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
    description: 'Energy-efficient LED table lamp with adjustable brightness',
    category: 'Home',
    rating: { average: 4.7, count: 78 },
    stock: 90,
    status: 'active'
  },
  {
    name: 'Wall Clock',
    price: 149,
    image: '🕰️',
    description: 'Stylish wall clock for home decor',
    category: 'Home',
    rating: { average: 4.4, count: 32 },
    stock: 120,
    status: 'active'
  },
  {
    name: 'Kitchen Set',
    price: 499,
    image: '🍽️',
    description: 'Complete kitchen utensil set for cooking enthusiasts',
    category: 'Home',
    rating: { average: 4.8, count: 54 },
    stock: 60,
    status: 'active'
  },
  {
    name: 'Cozy Blanket',
    price: 399,
    image: '🛏️',
    description: 'Soft and cozy blanket for all seasons',
    category: 'Home',
    rating: { average: 4.9, count: 80 },
    stock: 85,
    status: 'active'
  },
  {
    name: 'Garden Plant Pot',
    price: 199,
    image: '🪴',
    description: 'Beautiful ceramic plant pot for indoor and outdoor plants',
    category: 'Home',
    rating: { average: 4.5, count: 67 },
    stock: 95,
    status: 'active'
  },
  {
    name: 'Coffee Maker',
    price: 599,
    image: '☕',
    description: 'Automatic coffee maker for perfect brew every time',
    category: 'Home',
    rating: { average: 4.6, count: 43 },
    stock: 50,
    status: 'active'
  },
  {
    name: 'Bedside Table',
    price: 449,
    image: '🛏️',
    description: 'Elegant bedside table with storage drawer',
    category: 'Home',
    rating: { average: 4.3, count: 28 },
    stock: 40,
    status: 'active'
  },

  // ===== SPORTS & FITNESS =====
  {
    name: 'Football',
    price: 299,
    image: '⚽',
    description: 'Durable football for outdoor play and training',
    category: 'Sports',
    rating: { average: 4.7, count: 110 },
    stock: 120,
    status: 'active'
  },
  {
    name: 'Tennis Racket',
    price: 799,
    image: '🎾',
    description: 'Lightweight tennis racket for all skill levels',
    category: 'Sports',
    rating: { average: 4.6, count: 70 },
    stock: 45,
    status: 'active'
  },
  {
    name: 'Yoga Mat',
    price: 249,
    image: '🧘',
    description: 'Non-slip yoga mat for fitness routines and meditation',
    category: 'Sports',
    rating: { average: 4.8, count: 95 },
    stock: 85,
    status: 'active'
  },
  {
    name: 'Cricket Bat',
    price: 599,
    image: '🏏',
    description: 'Professional cricket bat for matches and practice',
    category: 'Sports',
    rating: { average: 4.5, count: 60 },
    stock: 55,
    status: 'active'
  },
  {
    name: 'Basketball',
    price: 349,
    image: '🏀',
    description: 'High-quality basketball for indoor and outdoor courts',
    category: 'Sports',
    rating: { average: 4.7, count: 85 },
    stock: 75,
    status: 'active'
  },
  {
    name: 'Dumbbells Set',
    price: 449,
    image: '🏋️',
    description: 'Adjustable dumbbells set for home workouts',
    category: 'Sports',
    rating: { average: 4.6, count: 52 },
    stock: 40,
    status: 'active'
  },
  {
    name: 'Running Shoes',
    price: 699,
    image: '👟',
    description: 'Comfortable running shoes with cushioning technology',
    category: 'Sports',
    rating: { average: 4.8, count: 134 },
    stock: 60,
    status: 'active'
  },
  {
    name: 'Cycling Helmet',
    price: 299,
    image: '🚴',
    description: 'Safety cycling helmet with ventilation',
    category: 'Sports',
    rating: { average: 4.4, count: 38 },
    stock: 70,
    status: 'active'
  },

  // ===== BOOKS =====
  {
    name: 'Programming Guide',
    price: 399,
    image: '📚',
    description: 'Complete guide to modern programming languages',
    category: 'Books',
    rating: { average: 4.7, count: 89 },
    stock: 100,
    status: 'active'
  },
  {
    name: 'Fiction Novel',
    price: 299,
    image: '📖',
    description: 'Bestselling fiction novel with captivating storyline',
    category: 'Books',
    rating: { average: 4.5, count: 156 },
    stock: 150,
    status: 'active'
  },
  {
    name: 'Cookbook Collection',
    price: 499,
    image: '📖',
    description: 'Comprehensive cookbook with international recipes',
    category: 'Books',
    rating: { average: 4.8, count: 67 },
    stock: 80,
    status: 'active'
  },
  {
    name: 'Self-Help Book',
    price: 249,
    image: '📚',
    description: 'Motivational self-help book for personal development',
    category: 'Books',
    rating: { average: 4.6, count: 92 },
    stock: 120,
    status: 'active'
  },
  {
    name: 'Science Textbook',
    price: 599,
    image: '📖',
    description: 'Comprehensive science textbook for students',
    category: 'Books',
    rating: { average: 4.4, count: 45 },
    stock: 90,
    status: 'active'
  },

  // ===== BEAUTY & HEALTH =====
  {
    name: 'Skincare Set',
    price: 399,
    image: '🧴',
    description: 'Complete skincare set for daily routine',
    category: 'Beauty',
    rating: { average: 4.7, count: 78 },
    stock: 85,
    status: 'active'
  },
  {
    name: 'Makeup Kit',
    price: 599,
    image: '💄',
    description: 'Professional makeup kit with all essentials',
    category: 'Beauty',
    rating: { average: 4.6, count: 95 },
    stock: 60,
    status: 'active'
  },
  {
    name: 'Hair Dryer',
    price: 349,
    image: '💇',
    description: 'Professional hair dryer with multiple settings',
    category: 'Beauty',
    rating: { average: 4.5, count: 67 },
    stock: 75,
    status: 'active'
  },
  {
    name: 'Perfume Set',
    price: 799,
    image: '🌸',
    description: 'Luxury perfume set with multiple fragrances',
    category: 'Beauty',
    rating: { average: 4.8, count: 43 },
    stock: 40,
    status: 'active'
  },
  {
    name: 'Electric Toothbrush',
    price: 299,
    image: '🦷',
    description: 'Smart electric toothbrush with timer',
    category: 'Beauty',
    rating: { average: 4.6, count: 89 },
    stock: 95,
    status: 'active'
  },

  // ===== TOYS & GAMES =====
  {
    name: 'Board Game Collection',
    price: 399,
    image: '🎲',
    description: 'Family board game collection for entertainment',
    category: 'Toys',
    rating: { average: 4.7, count: 56 },
    stock: 70,
    status: 'active'
  },
  {
    name: 'Remote Control Car',
    price: 299,
    image: '🚗',
    description: 'High-speed remote control car for kids',
    category: 'Toys',
    rating: { average: 4.5, count: 78 },
    stock: 85,
    status: 'active'
  },
  {
    name: 'Building Blocks Set',
    price: 199,
    image: '🧱',
    description: 'Creative building blocks for children',
    category: 'Toys',
    rating: { average: 4.8, count: 92 },
    stock: 100,
    status: 'active'
  },
  {
    name: 'Puzzle Set',
    price: 149,
    image: '🧩',
    description: 'Brain-teasing puzzle set for all ages',
    category: 'Toys',
    rating: { average: 4.4, count: 45 },
    stock: 120,
    status: 'active'
  },
  {
    name: 'Art & Craft Kit',
    price: 249,
    image: '🎨',
    description: 'Complete art and craft kit for creative kids',
    category: 'Toys',
    rating: { average: 4.6, count: 67 },
    stock: 80,
    status: 'active'
  },

  // ===== AUTOMOTIVE =====
  {
    name: 'Car Phone Mount',
    price: 199,
    image: '🚗',
    description: 'Universal car phone mount for safe driving',
    category: 'Automotive',
    rating: { average: 4.5, count: 89 },
    stock: 150,
    status: 'active'
  },
  {
    name: 'Car Air Freshener',
    price: 99,
    image: '🌺',
    description: 'Long-lasting car air freshener with pleasant scent',
    category: 'Automotive',
    rating: { average: 4.3, count: 67 },
    stock: 200,
    status: 'active'
  },
  {
    name: 'Car Vacuum Cleaner',
    price: 399,
    image: '🧹',
    description: 'Portable car vacuum cleaner for interior cleaning',
    category: 'Automotive',
    rating: { average: 4.6, count: 45 },
    stock: 60,
    status: 'active'
  },

  // ===== PET SUPPLIES =====
  {
    name: 'Pet Food Bowl',
    price: 149,
    image: '🐕',
    description: 'Stainless steel pet food bowl for dogs and cats',
    category: 'Pet Supplies',
    rating: { average: 4.7, count: 78 },
    stock: 100,
    status: 'active'
  },
  {
    name: 'Pet Toy Set',
    price: 199,
    image: '🐾',
    description: 'Interactive pet toy set for dogs and cats',
    category: 'Pet Supplies',
    rating: { average: 4.5, count: 56 },
    stock: 85,
    status: 'active'
  },
  {
    name: 'Pet Bed',
    price: 299,
    image: '🛏️',
    description: 'Comfortable pet bed for dogs and cats',
    category: 'Pet Supplies',
    rating: { average: 4.6, count: 43 },
    stock: 70,
    status: 'active'
  },

  // ===== OFFICE SUPPLIES =====
  {
    name: 'Wireless Mouse',
    price: 199,
    image: '🖱️',
    description: 'Ergonomic wireless mouse for office use',
    category: 'Office Supplies',
    rating: { average: 4.5, count: 89 },
    stock: 120,
    status: 'active'
  },
  {
    name: 'Desk Organizer',
    price: 149,
    image: '📁',
    description: 'Multi-compartment desk organizer for office supplies',
    category: 'Office Supplies',
    rating: { average: 4.4, count: 67 },
    stock: 95,
    status: 'active'
  },
  {
    name: 'Laptop Stand',
    price: 299,
    image: '💻',
    description: 'Adjustable laptop stand for ergonomic workspace',
    category: 'Office Supplies',
    rating: { average: 4.6, count: 78 },
    stock: 80,
    status: 'active'
  }
];

// Sample users for testing
const SAMPLE_USERS = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'user'
  }
];

// Sample orders for testing
const SAMPLE_ORDERS = [
  {
    items: [
      { product: 'Premium Wireless Headphones', quantity: 1, price: 299 },
      { product: 'Smart Watch', quantity: 1, price: 399 }
    ],
    totalAmount: 698,
    paymentMethod: 'cod',
    paymentStatus: 'cod_pending',
    orderStatus: 'processing',
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    }
  },
  {
    items: [
      { product: 'Gaming Laptop', quantity: 1, price: 1299 }
    ],
    totalAmount: 1299,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'confirmed',
    address: {
      street: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India'
    }
  }
];

async function populateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-ecommerce');
    console.log('✅ Connected to MongoDB');

    // Check if products already exist
    const existingProductCount = await Product.countDocuments();
    if (existingProductCount > 0) {
      console.log(`⚠️ Database already has ${existingProductCount} products. Skipping population to avoid duplicates.`);
      console.log('💡 To repopulate, manually delete products first or modify this script.');
      await mongoose.disconnect();
      return;
    }

    console.log('📦 Database is empty. Starting population...');

    // Create sample users (only if they don't exist)
    console.log('👥 Creating sample users...');
    const bcrypt = require('bcryptjs');
    const createdUsers = [];
    
    for (const userData of SAMPLE_USERS) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️ User already exists: ${userData.email}`);
        createdUsers.push(existingUser);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    // Create products
    console.log('📦 Creating products...');
    const createdProducts = await Product.insertMany(ALL_PRODUCTS);
    console.log(`✅ Created ${createdProducts.length} products across all categories`);

    // Display category summary
    const categoryCounts = {};
    createdProducts.forEach(product => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });

    console.log('\n📊 Product Categories Summary:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

    // Create sample orders (only if users were created)
    if (createdUsers.length > 0) {
      console.log('\n📋 Creating sample orders...');
      for (let i = 0; i < SAMPLE_ORDERS.length; i++) {
        const orderData = SAMPLE_ORDERS[i];
        const user = createdUsers[i % createdUsers.length];
        
        // Find products for the order
        const orderItems = orderData.items.map(item => {
          const product = createdProducts.find(p => p.name === item.product);
          return {
            product: product._id,
            quantity: item.quantity,
            price: item.price
          };
        });

        const order = await Order.create({
          user: user._id,
          items: orderItems,
          totalAmount: orderData.totalAmount,
          address: orderData.address,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: orderData.paymentStatus,
          orderStatus: orderData.orderStatus,
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });

        console.log(`✅ Created order for ${user.name}: ${orderData.items.length} items, ₹${orderData.totalAmount}`);
      }
    }

    // Final summary
    console.log('\n🎉 Database Population Complete!');
    console.log('================================');
    console.log(`📦 Total Products: ${createdProducts.length}`);
    console.log(`👥 Total Users: ${createdUsers.length}`);
    console.log(`📋 Total Orders: ${SAMPLE_ORDERS.length}`);
    console.log('\n🔗 You can now test the application with:');
    console.log('   - Admin login: admin@example.com / admin123');
    console.log('   - User logins: john@example.com, jane@example.com, mike@example.com / password123');

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the population script
populateDatabase(); 