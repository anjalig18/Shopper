const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

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

const testPassword = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Testing password functionality...');
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' }).select('+password');
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('✅ Admin user found:', {
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
      hasPassword: !!adminUser.password
    });
    
    console.log('Current password hash:', adminUser.password);
    
    // Test with bcrypt directly
    const testPassword = 'admin123';
    const directMatch = await bcrypt.compare(testPassword, adminUser.password);
    console.log('Direct bcrypt comparison:', directMatch ? '✅ Valid' : '❌ Invalid');
    
    // Test with model method
    const modelMatch = await adminUser.matchPassword(testPassword);
    console.log('Model method comparison:', modelMatch ? '✅ Valid' : '❌ Invalid');
    
    // Test with wrong password
    const wrongMatch = await adminUser.matchPassword('wrongpassword');
    console.log('Wrong password test:', wrongMatch ? '❌ Should be false' : '✅ Correctly false');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

testPassword(); 