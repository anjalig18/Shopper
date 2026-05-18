const express = require('express');
const router = express.Router();
const { register, login, updateProfile, adminLogin } = require('../controllers/authController');

// Auth and profile routes
router.post('/register', register);
router.post('/login', login);
router.put('/profile', updateProfile);

// Admin login route
router.post('/admin', adminLogin);

// Public GET profile by email (from query param)
router.get('/profile', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email required' });
  const User = require('../models/User');
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { _id, name, email: userEmail, role } = user;
  res.json({ user: { _id, name, email: userEmail, role } });
});

module.exports = router; 