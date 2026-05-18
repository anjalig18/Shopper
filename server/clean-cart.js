const mongoose = require('mongoose');
const Cart = require('./models/Cart');

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

const cleanCart = async () => {
  try {
    await connectDB();
    
    console.log('🧹 Cleaning cart data...');
    
    // Find all carts
    const carts = await Cart.find({});
    console.log(`Found ${carts.length} carts`);
    
    for (const cart of carts) {
      console.log(`\nProcessing cart for user: ${cart.user}`);
      console.log(`Items before cleaning: ${cart.items.length}`);
      
      // Filter out items with null/undefined product references
      const originalLength = cart.items.length;
      cart.items = cart.items.filter(item => {
        if (!item.product) {
          console.log(`  Removing item with null product, quantity: ${item.quantity}`);
          return false;
        }
        return true;
      });
      
      const removedCount = originalLength - cart.items.length;
      if (removedCount > 0) {
        console.log(`  Removed ${removedCount} items with null products`);
        await cart.save();
      }
      
      console.log(`Items after cleaning: ${cart.items.length}`);
    }
    
    console.log('\n✅ Cart cleaning completed!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

cleanCart(); 