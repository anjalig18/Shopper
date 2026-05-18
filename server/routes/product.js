const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
  // getProductById // Uncomment if you implement this
} = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.get('/', getProducts);
// router.get('/:id', getProductById); // Uncomment if you implement this

// Protected admin routes for product management
router.post('/', auth, adminAuth, createProduct);
router.put('/:id', auth, adminAuth, updateProduct);
router.delete('/:id', auth, adminAuth, deleteProduct);

module.exports = router; 