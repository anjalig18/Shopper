const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateUsers,
  bulkUpdateProducts
} = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');

// Apply authentication middleware
router.use(auth);
router.use(adminAuth);

// Dashboard routes
router.get('/stats', getDashboardStats);

// User management routes (specific routes BEFORE parameterized routes)
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.patch('/users/bulk-update', bulkUpdateUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Product management routes (specific routes BEFORE parameterized routes)
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.patch('/products/bulk-update', bulkUpdateProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;