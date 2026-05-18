const Product = require('../models/Product');

// Sample products data to ensure we have products in DB
const SAMPLE_PRODUCTS = [
  {
    _id: '674d8b8c123456789abcdef1',
    name: 'Premium Wireless Headphones',
    price: 299,
    image: '🎧',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics',
    rating: 4.8,
    reviews: 124,
    inStock: true
  },
  {
    _id: '674d8b8c123456789abcdef2',
    name: 'Smart Fitness Tracker',
    price: 199,
    image: '⌚',
    description: 'Track your fitness goals with this smart device',
    category: 'Electronics',
    rating: 4.6,
    reviews: 89,
    inStock: true
  },
  {
    _id: '674d8b8c123456789abcdef3',
    name: 'Professional Camera',
    price: 899,
    image: '📸',
    description: 'Capture stunning photos with professional quality',
    category: 'Electronics',
    rating: 4.9,
    reviews: 256,
    inStock: true
  },
  {
    _id: '674d8b8c123456789abcdef4',
    name: 'Gaming Laptop',
    price: 1299,
    image: '💻',
    description: 'High-performance laptop for gaming enthusiasts',
    category: 'Electronics',
    rating: 4.7,
    reviews: 178,
    inStock: true
  },
  {
    _id: '674d8b8c123456789abcdef5',
    name: 'Bluetooth Speaker',
    price: 149,
    image: '🔊',
    description: 'Portable speaker with excellent sound quality',
    category: 'Electronics',
    rating: 4.5,
    reviews: 92,
    inStock: true
  },
  {
    _id: '674d8b8c123456789abcdef6',
    name: 'Smart Watch',
    price: 399,
    image: '⌚',
    description: 'Stay connected with this feature-rich smartwatch',
    category: 'Electronics',
    rating: 4.8,
    reviews: 203,
    inStock: true
  }
];

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;
    const product = await Product.create({ name, price, description, category, image });
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { search = '' } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    // If no products found in database, return sample products
    if (products.length === 0) {
      const filteredSampleProducts = SAMPLE_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
      );
      return res.json({ products: filteredSampleProducts });
    }
    
    res.json({ products });
  } catch (err) {
    console.error('Error fetching products:', err);
    // Fallback to sample products
    const { search = '' } = req.query;
    const filteredSampleProducts = SAMPLE_PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
    );
    res.json({ products: filteredSampleProducts });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    // If not found in DB, check sample products
    if (!product) {
      product = SAMPLE_PRODUCTS.find(p => p._id === req.params.id);
    }
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('Product found:', product.name);
    res.json(product);
  } catch (err) {
    console.error('Get product by ID error:', err);
    
    // Try to find in sample products as fallback
    const product = SAMPLE_PRODUCTS.find(p => p._id === req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, image } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, description, category, image },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Initialize sample products in database (utility function)
exports.initializeSampleProducts = async () => {
  try {
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      console.log('No products found, creating sample products...');
      
      for (const productData of SAMPLE_PRODUCTS) {
        await Product.create(productData);
      }
      
      console.log('Sample products created successfully');
    } else {
      console.log(`Database already has ${existingProducts} products`);
    }
  } catch (error) {
    console.error('Error initializing sample products:', error);
  }
};