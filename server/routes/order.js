const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  getOrderById,
  deleteCancelledOrder,
  deleteAllUserOrders
} = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');

// All order routes require authentication
router.use(auth);

// User order routes (specific paths first)
router.post('/place', placeOrder);
router.get('/my', getUserOrders);
router.delete('/all', deleteAllUserOrders);

// Admin order routes (specific routes before parameterized routes)
router.get('/all', adminAuth, getAllOrders);

// Specific action routes (before generic /:id)
router.put('/cancel/:id', cancelOrder);
router.put('/status/:id', adminAuth, updateOrderStatus);

// Generic parameterized routes (must come LAST)
router.get('/:id', getOrderById);

// DELETE with conditional logic based on user role and query param
router.delete('/:id', async (req, res, next) => {
  if (req.query.type === 'cancelled') {
    return deleteCancelledOrder(req, res, next);
  }
  // Admin delete
  return adminAuth(req, res, () => deleteOrder(req, res, next));
});

module.exports = router; 