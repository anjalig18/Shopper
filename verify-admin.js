const mongoose = require('mongoose');
const User = require('./server/models/User');

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

const verifyAdmin = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Checking admin user...');
    
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
      name: adminUser.name,
      hasPassword: !!adminUser.password
    });
    
    // Test password
    const isPasswordValid = await adminUser.matchPassword('admin123');
    console.log('🔐 Password test:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    
    // Test admin role query
    const adminByRole = await User.findOne({ email: 'admin@example.com', role: 'admin' }).select('+password');
    console.log('👑 Admin by role query:', adminByRole ? '✅ Found' : '❌ Not found');
    
    if (adminByRole) {
      console.log('Admin by role details:', {
        id: adminByRole._id,
        email: adminByRole.email,
        role: adminByRole.role
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

verifyAdmin(); 