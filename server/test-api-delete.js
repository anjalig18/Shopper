const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

async function testApiDelete() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-ecommerce');
    console.log('Connected to MongoDB');

    // Get a sample order
    const sampleOrder = await Order.findOne();
    if (!sampleOrder) {
      console.log('No orders found in database');
      return;
    }

    console.log('Sample order found:', {
      id: sampleOrder._id,
      user: sampleOrder.user,
      status: sampleOrder.orderStatus
    });

    // Test the delete function directly
    const { deleteCancelledOrder } = require('./controllers/orderController');
    
    // Create a mock request and response
    const mockReq = {
      params: { id: sampleOrder._id.toString() },
      body: { userId: sampleOrder.user.toString() }
    };
    
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          console.log(`Response status: ${code}`);
          console.log('Response data:', data);
          return mockRes;
        }
      }),
      json: (data) => {
        console.log('Response data:', data);
        return mockRes;
      }
    };

    console.log('Testing deleteCancelledOrder function...');
    await deleteCancelledOrder(mockReq, mockRes);

    // Verify deletion
    const remainingOrders = await Order.countDocuments();
    console.log('Remaining orders in database:', remainingOrders);
    
    const foundOrder = await Order.findById(sampleOrder._id);
    if (!foundOrder) {
      console.log('✅ Order successfully deleted via API function');
    } else {
      console.log('❌ Order still found in database after API deletion');
    }

  } catch (error) {
    console.error('Error testing API delete:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testApiDelete(); 