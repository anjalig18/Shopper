const mongoose = require('mongoose');
const User = require('./models/User');

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

const testAdminLogin = async () => {
  try {
    await connectDB();
    
    console.log('🔐 Testing admin login functionality...');
    
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
    
    // Test password matching
    const testPassword = 'admin123';
    const isMatch = await adminUser.matchPassword(testPassword);
    console.log('🔐 Password test result:', isMatch ? '✅ Valid' : '❌ Invalid');
    
    if (isMatch) {
      console.log('✅ Admin login should work with: admin@example.com / admin123');
      
      // Test the getPublicProfile method
      const publicProfile = adminUser.getPublicProfile();
      console.log('📋 Public profile:', publicProfile);
    } else {
      console.log('❌ Admin login will fail - password mismatch');
    }
    
    // Test with wrong password
    const wrongMatch = await adminUser.matchPassword('wrongpassword');
    console.log('🔐 Wrong password test:', wrongMatch ? '❌ Should be false' : '✅ Correctly false');
    
  } catch (error) {
    console.error('❌ Error testing admin login:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

testAdminLogin(); 