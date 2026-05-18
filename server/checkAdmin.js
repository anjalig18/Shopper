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

const checkAndFixAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('Admin user does not exist. Creating...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const newAdmin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin user created successfully:', {
        id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role
      });
    } else {
      console.log('Admin user exists:', {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name
      });
      
      // Check if role is admin
      if (adminUser.role !== 'admin') {
        console.log('⚠️ Admin user exists but role is not "admin". Updating...');
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('✅ Admin role updated successfully');
      }
      
      // Test password
      const isPasswordValid = await adminUser.matchPassword('admin123');
      if (!isPasswordValid) {
        console.log('⚠️ Admin password is incorrect. Updating...');
        adminUser.password = await bcrypt.hash('admin123', 12);
        await adminUser.save();
        console.log('✅ Admin password updated successfully');
      } else {
        console.log('✅ Admin password is correct');
      }
    }
    
    // List all users for debugging
    console.log('\n📋 All users in database:');
    const allUsers = await User.find({}).select('-password');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.name}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

checkAndFixAdmin(); 