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

const checkAdmin = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Checking admin user details...');
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' }).select('+password');
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('  ID:', adminUser._id);
    console.log('  Email:', adminUser.email);
    console.log('  Name:', adminUser.name);
    console.log('  Role:', adminUser.role);
    console.log('  Status:', adminUser.status);
    console.log('  Has Password:', !!adminUser.password);
    console.log('  Password Hash:', adminUser.password);
    
    // Test password matching
    const testPassword = 'admin123';
    const isMatch = await adminUser.matchPassword(testPassword);
    console.log('  Password Match:', isMatch);
    
    // Check if user has admin role
    if (adminUser.role !== 'admin') {
      console.log('⚠️  WARNING: User does not have admin role!');
      console.log('  Current role:', adminUser.role);
      console.log('  Expected role: admin');
    } else {
      console.log('✅ User has correct admin role');
    }
    
    // Test the query that adminLogin uses
    const adminQueryResult = await User.findOne({ email: 'admin@example.com', role: 'admin' }).select('+password');
    console.log('  Admin query result:', adminQueryResult ? 'Found' : 'Not found');
    
  } catch (error) {
    console.error('❌ Error checking admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
};

checkAdmin(); 