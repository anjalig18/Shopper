const mongoose = require('mongoose');
const Cart = require('./models/Cart');
const User = require('./models/User');
const Product = require('./models/Product');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const testCart = async () => {
  try {
    await connectDB();
    
    console.log('🧪 Testing cart functionality...');
    
    // Find or create a test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        role: 'user'
      });
      console.log('✅ Created test user:', testUser.email);
    } else {
      console.log('✅ Found existing test user:', testUser.email);
    }
    
    // Find or create test products
    let products = await Product.find({}).limit(3);
    if (products.length === 0) {
      products = await Product.create([
        {
          name: 'Test Product 1',
          price: 100,
          description: 'Test product 1 description',
          category: 'Electronics',
          image: '📱',
          rating: 4.5,
          reviews: 10
        },
        {
          name: 'Test Product 2',
          price: 200,
          description: 'Test product 2 description',
          category: 'Fashion',
          image: '👕',
          rating: 4.0,
          reviews: 5
        },
        {
          name: 'Test Product 3',
          price: 150,
          description: 'Test product 3 description',
          category: 'Home',
          image: '🏠',
          rating: 4.8,
          reviews: 15
        }
      ]);
      console.log('✅ Created test products');
    } else {
      console.log('✅ Found existing products');
    }
    
    // Find or create cart for test user
    let cart = await Cart.findOne({ user: testUser._id });
    if (!cart) {
      cart = new Cart({
        user: testUser._id,
        items: []
      });
      console.log('✅ Created new cart for test user');
    } else {
      console.log('✅ Found existing cart for test user');
    }
    
    // Add products to cart
    console.log('\n📦 Adding products to cart...');
    for (const product of products) {
      const existingItem = cart.items.find(item => item.product.toString() === product._id.toString());
      if (existingItem) {
        existingItem.quantity += 1;
        console.log(`  Updated quantity for ${product.name}`);
      } else {
        cart.items.push({
          product: product._id,
          quantity: 1
        });
        console.log(`  Added ${product.name} to cart`);
      }
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    console.log('\n🛒 Current cart contents:');
    cart.items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.product.name} - Quantity: ${item.quantity} - Price: ₹${item.product.price}`);
    });
    
    console.log(`\n💰 Total items: ${cart.items.length}`);
    console.log(`💰 Total price: ₹${cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}`);
    
    // Test removing an item
    if (cart.items.length > 0) {
      const itemToRemove = cart.items[0];
      console.log(`\n🗑️ Testing removal of: ${itemToRemove.product.name}`);
      
      cart.items = cart.items.filter(item => item.product._id.toString() !== itemToRemove.product._id.toString());
      await cart.save();
      await cart.populate('items.product');
      
      console.log('✅ Item removed successfully');
      console.log(`🛒 Cart now has ${cart.items.length} items`);
    }
    
    console.log('\n✅ Cart functionality test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing cart:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

testCart(); 