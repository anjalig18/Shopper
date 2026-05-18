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

const fixAdminPassword = async () => {
  try {
    await connectDB();
    
    console.log('🔧 Fixing admin password...');
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('✅ Admin user found:', {
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role
    });
    
    // Update password to admin123
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    adminUser.password = hashedPassword;
    await adminUser.save();
    
    console.log('✅ Admin password updated successfully!');
    console.log('New password hash:', hashedPassword);
    
    // Test the new password
    const isMatch = await adminUser.matchPassword(newPassword);
    console.log('🔐 Password test after update:', isMatch ? '✅ Valid' : '❌ Invalid');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

fixAdminPassword(); 