const Cart = require('../models/Cart');

// Get all cart items (for demo, returns all carts)
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: 'userId and productId are required' });
    }
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    
    const itemIndex = cart.items.findIndex(item => 
      item.product && item.product.toString() === productId
    );
    
    if (itemIndex > -1) {
      // Update existing item quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    console.log('Cart updated:', {
      userId,
      productId,
      quantity,
      totalItems: cart.items.length,
      items: cart.items.map(item => ({
        product: item.product?.name || item.product,
        quantity: item.quantity
      }))
    });
    
    res.json({ cart });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });
    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Filter out items where product is null/undefined or doesn't match productId
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => {
      if (!item.product) {
        return false;
      }
      const itemProductId = item.product.toString();
      const shouldRemove = itemProductId === productId;
      return !shouldRemove;
    });
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json({ cart });
  } catch (err) {
    console.error('Error in removeFromCart:', err);
    res.status(500).json({ message: err.message });
  }
};