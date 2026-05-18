const Razorpay = require('razorpay');
const razorpay = require('../config/razorpay');

// Create a new Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    const options = {
      amount: Math.round(amount), // amount in paise
      currency,
      receipt: receipt || `order_rcptid_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify payment (dummy implementation)
exports.verifyPayment = async (req, res) => {
  try {
    // In production, verify signature and payment status
    res.json({ success: true, message: 'Payment verified (dummy)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};