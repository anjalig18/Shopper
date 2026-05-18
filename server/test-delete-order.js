const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

async function testOrderDeletion() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-ecommerce');
    console.log('Connected to MongoDB');

    // First, let's see how many orders we have
    const totalOrders = await Order.countDocuments();
    console.log('Total orders in database:', totalOrders);

    // Get a sample order
    const sampleOrder = await Order.findOne();
    if (!sampleOrder) {
      console.log('No orders found in database');
      return;
    }

    console.log('Sample order found:', {
      id: sampleOrder._id,
      user: sampleOrder.user,
      status: sampleOrder.orderStatus,
      totalAmount: sampleOrder.totalAmount
    });

    // Test deletion
    console.log('Testing order deletion...');
    const deletedOrder = await Order.findByIdAndDelete(sampleOrder._id);
    
    if (deletedOrder) {
      console.log('Order deleted successfully:', deletedOrder._id);
      
      // Verify deletion
      const remainingOrders = await Order.countDocuments();
      console.log('Remaining orders in database:', remainingOrders);
      
      // Try to find the deleted order
      const foundOrder = await Order.findById(sampleOrder._id);
      if (!foundOrder) {
        console.log('✅ Order successfully deleted and not found in database');
      } else {
        console.log('❌ Order still found in database after deletion');
      }
    } else {
      console.log('❌ Failed to delete order');
    }

  } catch (error) {
    console.error('Error testing order deletion:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testOrderDeletion(); 