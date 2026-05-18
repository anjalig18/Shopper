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

const updateAdminPassword = async () => {
  try {
    await connectDB();
    
    console.log('🔄 Updating admin password...');
    
    // Delete existing admin user
    const deletedAdmin = await User.findOneAndDelete({ email: 'admin@example.com' });
    if (deletedAdmin) {
      console.log('🗑️ Deleted existing admin user');
    }
    
    // Create new admin user with plain password (will be hashed by pre-save middleware)
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed by the pre-save middleware
      role: 'admin',
      status: 'active'
    });
    
    await adminUser.save();
    
    console.log('✅ New admin user created successfully!');
    console.log('Admin details:', {
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
      name: adminUser.name
    });
    
    // Test the password
    const isMatch = await adminUser.matchPassword('admin123');
    console.log('🔐 Password test:', isMatch ? '✅ Valid' : '❌ Invalid');
    
    // Test with wrong password
    const wrongMatch = await adminUser.matchPassword('wrongpassword');
    console.log('🔐 Wrong password test:', wrongMatch ? '❌ Should be false' : '✅ Correctly false');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

updateAdminPassword(); 