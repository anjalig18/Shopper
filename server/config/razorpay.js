const Razorpay = require('razorpay');

// Load environment variables
require('dotenv').config();

console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');

// Check if keys are available
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Razorpay configuration error: Missing API keys');
  console.error('Please check your .env file and ensure it contains:');
  console.error('RAZORPAY_KEY_ID=your_key_id');
  console.error('RAZORPAY_KEY_SECRET=your_key_secret');
  throw new Error('Razorpay API keys are missing from environment variables');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log('Razorpay instance created successfully');

module.exports = razorpay;