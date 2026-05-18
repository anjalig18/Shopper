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

const listUsers = async () => {
  try {
    await connectDB();
    
    console.log('📋 Listing all users in database...');
    
    const users = await User.find({}).select('-password');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log(`✅ Found ${users.length} user(s):`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.role}) - ${user.name}`);
      });
    }
    
    // Also check specifically for admin
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (adminUser) {
      console.log('\n👑 Admin user details:', {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name
      });
    } else {
      console.log('\n❌ No admin user found with email admin@example.com');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

listUsers(); 