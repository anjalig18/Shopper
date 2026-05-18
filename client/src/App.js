import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import PrivateRoute from './components/PrivateRoute';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Helper Functions
const api = {
  // Auth APIs
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  // Product APIs
  getProducts: async (search = '', token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(`${API_BASE_URL}/products?search=${search}`, { headers });
    return response.json();
  },

  // Cart APIs
  getCart: async (userId, token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(`${API_BASE_URL}/cart?userId=${userId}`, { headers });
    return response.json();
  },

  addToCart: async (userId, productId, quantity = 1, token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, productId, quantity })
    });
    return response.json();
  },

  updateCartItem: async (productId, quantity, token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ productId, quantity })
    });
    return response.json();
  },

  removeFromCart: async (userId, productId, token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    const response = await fetch(`${API_BASE_URL}/cart/remove`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ userId, productId })
    });
    return response.json();
  },

  // Order APIs
  getUserOrders: async (token, userId) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const url = userId ? `${API_BASE_URL}/orders/my?userId=${userId}` : `${API_BASE_URL}/orders/my`;
    
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  },

  placeOrder: async (orderData, token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    const response = await fetch(`${API_BASE_URL}/orders/place`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  },

  cancelOrder: async (orderId, reason, token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ reason })
    });
    const data = await response.json();
    return data;
  },

  deleteCancelledOrder: async (orderId, userId, token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    console.log('Making delete request to:', `${API_BASE_URL}/orders/${orderId}?type=cancelled`);
    console.log('Request body:', { userId });
    
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}?type=cancelled`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ userId })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    return data;
  },

  deleteAllOrders: async (userId, token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    console.log('Making delete all orders request to:', `${API_BASE_URL}/orders/all`);
    console.log('Request body:', { userId });
    
    const response = await fetch(`${API_BASE_URL}/orders/all`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ userId })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    return data;
  },

  getOrderById: async (orderId, token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, { headers });
    return response.json();
  },

  // Payment APIs
  createRazorpayOrder: async (amount, token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ amount, currency: 'INR', receipt: `order_${Date.now()}` })
    });
    return response.json();
  },

  verifyPayment: async (paymentData, token) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentData)
    });
    return response.json();
  }
};

// Enhanced Components
const AnnouncementBar = () => (
  <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 text-white text-center py-3 text-sm font-medium relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
    <div className="relative z-10 flex items-center justify-center gap-2">
      <span className="animate-bounce">🔥</span>
      <span>Amazing Products – Shop Now!</span>
      <span className="animate-bounce">🔥</span>
    </div>
  </div>
);

// Navbar component
const Navbar = ({ search, setSearch, currentPage, setCurrentPage, user, logout, cartItemCount }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 group hover:scale-105 transition-transform duration-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
              <span className="text-2xl">🛒</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              ShopHub
            </span>
          </button>
          <div className="flex-1 max-w-2xl w-full">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search for amazing products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-6 py-3 pl-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            {!user ? (
              <>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">🔑</span>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">Login</span>
                </button>
                <button
                  onClick={() => setCurrentPage('signup')}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">👤</span>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">Sign Up</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group ${
                    currentPage === 'dashboard' ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">👤</span>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">Dashboard</span>
                </button>
                <button
                  onClick={() => setCurrentPage('cart')}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group relative ${
                    currentPage === 'cart' ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <div className="relative">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">🛒</span>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">Cart</span>
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      console.log('Admin button clicked, navigating to /admin/dashboard');
                      window.location.href = '/admin/dashboard';
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group ${
                      currentPage === 'admin' ? 'bg-purple-50 text-purple-600' : ''
                    }`}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">⚙️</span>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-purple-600">Admin</span>
                  </button>
                )}
                <button
                  onClick={logout}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-red-100 transition-colors duration-200 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">🚪</span>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-red-600">Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

const CategoryNav = ({ setSearch, activeCategory, setActiveCategory }) => {
  const categories = [
    { name: 'All Products', color: 'from-blue-500 to-blue-600', searchTerm: '' },
    { name: 'Electronics', color: 'from-purple-500 to-purple-600', searchTerm: 'Electronics' },
    { name: 'Home Appliances', color: 'from-green-500 to-green-600', searchTerm: 'Home' },
    { name: 'Fashion', color: 'from-pink-500 to-pink-600', searchTerm: 'Fashion' },
    { name: 'Sports', color: 'from-orange-500 to-orange-600', searchTerm: 'Sports' },
    { name: 'Books', color: 'from-indigo-500 to-indigo-600', searchTerm: 'Books' },
    { name: 'More...', color: 'from-gray-500 to-gray-600', searchTerm: '' }
  ];

  const handleCategoryClick = (category) => {
    setActiveCategory(category.name);
    setSearch(category.searchTerm);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-3 rounded-xl bg-gradient-to-r ${category.color} text-white font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activeCategory === category.name ? 'ring-4 ring-blue-200 scale-105' : ''
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Updated constant product list with prices
const PRODUCT_LIST = [
  // Electronics
  { _id: '674d8b8c123456789abcdef1', name: 'Premium Wireless Headphones', price: 299, image: '🎧', rating: 4.8, reviews: 124, category: 'Electronics', description: 'High-quality wireless headphones with noise cancellation' },
  { _id: '674d8b8c123456789abcdef2', name: 'Smart Fitness Tracker', price: 199, image: '⌚', rating: 4.6, reviews: 89, category: 'Electronics', description: 'Track your fitness goals with this smart device' },
  { _id: '674d8b8c123456789abcdef3', name: 'Professional Camera', price: 899, image: '📸', rating: 4.9, reviews: 256, category: 'Electronics', description: 'Capture stunning photos with professional quality' },
  { _id: '674d8b8c123456789abcdef4', name: 'Gaming Laptop', price: 1299, image: '💻', rating: 4.7, reviews: 178, category: 'Electronics', description: 'High-performance laptop for gaming enthusiasts' },
  { _id: '674d8b8c123456789abcdef5', name: 'Bluetooth Speaker', price: 149, image: '🔊', rating: 4.5, reviews: 92, category: 'Electronics', description: 'Portable speaker with excellent sound quality' },
  { _id: '674d8b8c123456789abcdef6', name: 'Smart Watch', price: 399, image: '⌚', rating: 4.8, reviews: 203, category: 'Electronics', description: 'Stay connected with this feature-rich smartwatch' },
  // Fashion
  { _id: '674d8b8c123456789abcdfa1', name: 'Elegant Red Dress', price: 799, image: '👗', rating: 4.7, reviews: 88, category: 'Fashion', description: 'Stylish red dress for special occasions' },
  { _id: '674d8b8c123456789abcdfa2', name: 'Classic Blue Jeans', price: 499, image: '👖', rating: 4.5, reviews: 120, category: 'Fashion', description: 'Comfortable and durable blue jeans' },
  { _id: '674d8b8c123456789abcdfa3', name: 'Trendy Sneakers', price: 599, image: '👟', rating: 4.8, reviews: 150, category: 'Fashion', description: 'Trendy sneakers for everyday wear' },
  { _id: '674d8b8c123456789abcdfa4', name: 'Leather Handbag', price: 999, image: '👜', rating: 4.9, reviews: 60, category: 'Fashion', description: 'Premium leather handbag for all occasions' },
  { _id: '674d8b8c123456789abcdfa5', name: 'Summer Hat', price: 199, image: '👒', rating: 4.3, reviews: 34, category: 'Fashion', description: 'Lightweight hat for sunny days' },
  // Home
  { _id: '674d8b8c123456789abcdfb1', name: 'Modern Sofa', price: 2999, image: '🛋️', rating: 4.6, reviews: 45, category: 'Home', description: 'Comfortable modern sofa for your living room' },
  { _id: '674d8b8c123456789abcdfb2', name: 'LED Table Lamp', price: 299, image: '💡', rating: 4.7, reviews: 78, category: 'Home', description: 'Energy-efficient LED table lamp' },
  { _id: '674d8b8c123456789abcdfb3', name: 'Wall Clock', price: 149, image: '🕰️', rating: 4.4, reviews: 32, category: 'Home', description: 'Stylish wall clock for home decor' },
  { _id: '674d8b8c123456789abcdfb4', name: 'Kitchen Set', price: 499, image: '🍽️', rating: 4.8, reviews: 54, category: 'Home', description: 'Complete kitchen utensil set' },
  { _id: '674d8b8c123456789abcdfb5', name: 'Cozy Blanket', price: 399, image: '🛏️', rating: 4.9, reviews: 80, category: 'Home', description: 'Soft and cozy blanket for all seasons' },
  // Sports
  { _id: '674d8b8c123456789abcdfc1', name: 'Football', price: 299, image: '⚽', rating: 4.7, reviews: 110, category: 'Sports', description: 'Durable football for outdoor play' },
  { _id: '674d8b8c123456789abcdfc2', name: 'Tennis Racket', price: 799, image: '🎾', rating: 4.6, reviews: 70, category: 'Sports', description: 'Lightweight tennis racket for all levels' },
  { _id: '674d8b8c123456789abcdfc3', name: 'Yoga Mat', price: 249, image: '🧘', rating: 4.8, reviews: 95, category: 'Sports', description: 'Non-slip yoga mat for fitness routines' },
  { _id: '674d8b8c123456789abcdfc4', name: 'Cricket Bat', price: 599, image: '🏏', rating: 4.5, reviews: 60, category: 'Sports', description: 'Professional cricket bat for matches' },
  { _id: '674d8b8c123456789abcdfc5', name: 'Basketball', price: 349, image: '🏀', rating: 4.7, reviews: 85, category: 'Sports', description: 'High-quality basketball for indoor and outdoor' }
];

const Home = ({ search, user, addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts(search, user?.token);
        
        // Check if we got products from API
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        } else if (data && Array.isArray(data) && data.length > 0) {
          // Handle case where API returns array directly
          setProducts(data);
        } else {
          // Fallback to constant products if API fails
          const filteredProducts = PRODUCT_LIST.filter(p =>
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
          );
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Use filtered constant products as fallback
        const filteredProducts = PRODUCT_LIST.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
        );
        setProducts(filteredProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [search, user]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    await addToCart(productId, 1, user.token);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 mb-12 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Amazing Products
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Find everything you need in our curated collection of premium, high-quality products
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Shop Now
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Electronics', icon: '📱', color: 'from-blue-500 to-blue-600' },
            { name: 'Fashion', icon: '👗', color: 'from-pink-500 to-pink-600' },
            { name: 'Home', icon: '🏠', color: 'from-green-500 to-green-600' },
            { name: 'Sports', icon: '⚽', color: 'from-orange-500 to-orange-600' }
          ].map(({ name, icon, color }) => (
            <div key={name} className={`bg-gradient-to-br ${color} p-6 rounded-2xl text-center text-white hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer`}>
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-bold text-lg">{name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {search ? `Search Results for "${search}"` : 'Trending Products'}
        </h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try searching for something else</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                    {product.image || '📦'}
                  </div>
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Sale
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 mr-2">
                      {'★'.repeat(Math.floor((product.rating?.average ?? product.rating) || 4.5))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {(product.rating?.average ?? product.rating) || 4.5} ({product.rating?.count ?? product.reviews ?? 0} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.price + 50}</span>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                      Free Shipping
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product._id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Login component
const Login = ({ setCurrentPage, onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Direct admin login shortcut
    if (
      formData.email === 'admin@example.com' &&
      formData.password === 'admin123'
    ) {
      const adminUser = {
        _id: 'admin-id',
        name: 'Admin',
        email: formData.email,
        role: 'admin',
      };
      
      console.log('Admin login successful, setting user:', adminUser);
      
      // Save to localStorage
      localStorage.setItem('admin', JSON.stringify(adminUser));
      localStorage.setItem('adminToken', 'admin-demo-token');
      
      onLogin({
        user: adminUser,
        token: 'admin-demo-token'
      });
      
      // Navigate to admin dashboard immediately
      setCurrentPage('admin');
      return;
    }

    // Normal user login
    setLoading(true);
    try {
      const response = await api.login(formData);
      if (response.user) {
        onLogin({ user: response.user, token: response.token });
        setCurrentPage('dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({ email: 'admin@example.com', password: 'admin123' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <span className="text-4xl">🔐</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 text-lg">Sign in to continue your shopping journey</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Email Address</label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                
              </button>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => setCurrentPage('signup')}
                className="text-blue-600 hover:text-blue-500 font-bold"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Signup = ({ setCurrentPage, onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await api.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      if (response.user) {
        onLogin({ user: response.user, token: response.token });
        setCurrentPage('dashboard');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <span className="text-4xl">📝</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600 text-lg">Sign up to start your shopping journey</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Name</label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your name"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Email Address</label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Confirm Password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  placeholder="Confirm your password"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => setCurrentPage('login')}
                className="text-blue-600 hover:text-blue-500 font-bold"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Cart component
const Cart = ({ cart, user, removeFromCart, clearCart, refreshOrders, setCurrentPage }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  // Use cart as [{ product, quantity }]
  const cartItems = cart;

  const total = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = typeof item.product === 'object' ? (item.product?.price || 0) : 0;
    return sum + price * item.quantity;
  }, 0);

  // Remove item from cart
  const handleRemove = (productId) => {
    if (!productId) {
      return;
    }
    
    removeFromCart(productId);
  };

  // Show checkout form
  const handleCheckout = () => {
    if (!user) {
      setError('Please login to checkout');
      return;
    }
    setShowCheckout(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="w-full mb-4 text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, idx) => {
                // Handle both populated and unpopulated product references
                const productId = item.product ? (typeof item.product === 'object' ? item.product._id : item.product) : null;
                const productName = item.product ? (typeof item.product === 'object' ? item.product.name : 'Unknown') : 'Unknown Product';
                const productPrice = item.product ? (typeof item.product === 'object' ? item.product.price : 0) : 0;
                
                // Skip rendering if productId is null
                if (!productId) {
                  console.log('Skipping cart item with null productId:', item);
                  return null;
                }
                
                return (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{productName}</td>
                    <td>{item.quantity}</td>
                    <td>₹{productPrice}</td>
                    <td>₹{productPrice * item.quantity}</td>
                    <td>
                      <button
                        onClick={() => handleRemove(productId)}
                        className="text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="font-bold text-xl mb-4">Total: ₹{total}</div>
          
          {!showCheckout ? (
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="bg-red-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-xl"
              >
                Clear Cart
              </button>
            <button
              onClick={handleCheckout}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl"
            >
              Proceed to Checkout
            </button>
            </div>
          ) : (
            <Checkout 
              cartItems={cartItems} 
              total={total} 
              user={user} 
              onSuccess={() => {
                setSuccess('Order placed successfully! Check your dashboard for order details.');
                setShowCheckout(false);
                // Refresh orders and clear success message after delay
                refreshOrders();
                setTimeout(() => {
                  setSuccess('');
                }, 5000);
              }}
              onCancel={() => setShowCheckout(false)}
              removeFromCart={removeFromCart}
            />
          )}
          
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && (
            <div className="text-green-600 mt-2">
              <div>{success}</div>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                View My Orders
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// New Checkout component
const Checkout = ({ cartItems, total, user, onSuccess, onCancel, removeFromCart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  // Calculate delivery date (3-5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3);

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate address
      if (!address.street || !address.city || !address.state || !address.postalCode) {
        throw new Error('Please fill in all address fields');
      }

      if (paymentMethod === 'razorpay') {
        // Handle Razorpay payment
        const order = await api.createRazorpayOrder(total * 100, user.token);
        if (!order.id) throw new Error('Failed to create Razorpay order');
        
        const options = {
          key: 'rzp_test_1234567890abcdef',
          amount: order.amount,
          currency: order.currency,
          name: 'MERN Shop',
          description: 'Order Payment',
          order_id: order.id,
          handler: async function (response) {
            const verify = await api.verifyPayment(response, user.token);
            if (verify.success) {
              await placeOrderInBackend();
            } else {
              setError('Payment verification failed');
            }
          },
          prefill: {
            name: user.name,
            email: user.email
          },
          theme: { color: '#6366f1' }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Handle COD payment
        await placeOrderInBackend();
      }
    } catch (err) {
      setError(err.message || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  const placeOrderInBackend = async () => {
    try {
      console.log('Placing order with data:', { user: user._id, total, paymentMethod, address });
      
      const orderData = {
        userId: user._id,
        items: cartItems.filter(item => item.product).map(item => {
          const productId = typeof item.product === 'object' ? item.product._id : item.product;
          const productPrice = typeof item.product === 'object' ? item.product.price : 0;
          
          return { 
            product: productId, 
            quantity: item.quantity,
            price: productPrice
          };
        }),
        totalAmount: total,
        address,
        paymentMethod,
        deliveryDate: deliveryDate.toISOString()
      };

      console.log('Order data being sent:', orderData);

      const orderRes = await api.placeOrder(orderData, user.token);
      
      if (orderRes && orderRes.order) {
        
        // Clear cart items after successful order
        try {
          for (const item of cartItems) {
            if (item.product) {
              const productId = typeof item.product === 'object' ? item.product._id : item.product;
              await removeFromCart(productId);
            }
          }
        } catch (err) {
          console.log('Error clearing cart:', err);
        }
        
        // Call onSuccess to show success message
        onSuccess();
      } else {
        throw new Error(orderRes?.message || 'Order placement failed');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Order placement failed');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-2xl font-bold mb-4">Checkout</h3>
      
      {/* Order Summary */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Order Summary</h4>
        <div className="space-y-2">
          {cartItems.filter(item => item.product).map((item, idx) => {
            const productName = typeof item.product === 'object' ? item.product.name : 'Unknown';
            const productPrice = typeof item.product === 'object' ? item.product.price : 0;
            
            return (
              <div key={idx} className="flex justify-between">
                <span>{productName} x {item.quantity}</span>
                <span>₹{productPrice * item.quantity}</span>
              </div>
            );
          })}
          <div className="border-t pt-2 font-bold">
            <div className="flex justify-between">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Date:</span>
              <span>{deliveryDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <span>Cash on Delivery (COD)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="razorpay"
              checked={paymentMethod === 'razorpay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <span>Pay Online (Razorpay)</span>
          </label>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Delivery Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter street address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              value={address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter state"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Postal Code</label>
            <input
              type="text"
              value={address.postalCode}
              onChange={(e) => handleAddressChange('postalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter postal code"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back to Cart
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-2 px-6 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Online'}
        </button>
      </div>

      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

// Enhanced Dashboard component
const Dashboard = ({ user, setUser, refreshOrders }) => {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) {
        console.log('No user ID available:', { id: user?._id });
        return;
      }
      
      // Check if we have a token, if not, try to get one
      let userToken = user?.token;
      if (!userToken) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          userToken = parsedUser.token;
        }
      }
      setLoading(true);
      try {
        // Try direct fetch first
        try {
          const testUrl = `${API_BASE_URL}/orders/my?userId=${user._id}`;
          const testResponse = await fetch(testUrl);
          const testData = await testResponse.json();
          
          // If direct fetch works, use that data
          if (testData.orders && testData.orders.length > 0) {
            setOrders(testData.orders);
            setLoading(false);
            return;
          }
        } catch (err) {
          // Continue with API call if direct fetch fails
        }
        
        const data = await api.getUserOrders(userToken, user._id);
        
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password || undefined,
        }),
      });
      const profileData = await response.json();
      if (!response.ok) throw new Error(profileData.message || 'Update failed');
      setMsg('Profile updated!');
      setEdit(false);
      setUser(profileData.user);
    } catch (err) {
      setMsg(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    
    // Get token
    let userToken = user?.token;
    if (!userToken) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        userToken = parsedUser.token;
      }
    }
    
    console.log('Attempting to delete order:', { 
      orderId, 
      userId: user._id,
      userToken: userToken ? 'Present' : 'Missing',
      user: user
    });
    
    setCancellingOrder(orderId);
    try {
      // Directly delete the order from database
      const response = await api.deleteCancelledOrder(orderId, user._id, userToken);
      console.log('Delete response:', response);
      
      if (response.message) {
        setMsg('Order deleted successfully!');
        // Remove the order from the local state immediately
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        console.log('Order removed from local state');
      } else {
        setMsg('Failed to delete order');
        console.log('Failed to delete order:', response);
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      setMsg(err.message || 'Failed to delete order');
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleClearAllOrders = async () => {
    if (!window.confirm('Are you sure you want to delete ALL your orders? This action cannot be undone and will permanently remove all your order history.')) return;
    
    // Get token
    let userToken = user?.token;
    if (!userToken) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        userToken = parsedUser.token;
      }
    }
    
    console.log('Attempting to clear all orders for user:', user._id);
    
    try {
      const response = await api.deleteAllOrders(user._id, userToken);
      console.log('Clear all orders response:', response);
      
      if (response.message) {
        setMsg(`Successfully deleted ${response.deletedCount || 'all'} orders!`);
        // Clear all orders from local state
        setOrders([]);
        console.log('All orders cleared from local state');
      } else {
        setMsg('Failed to clear orders');
        console.log('Failed to clear orders:', response);
      }
    } catch (err) {
      console.error('Error clearing all orders:', err);
      setMsg(err.message || 'Failed to clear orders');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-blue-600';
      case 'confirmed': return 'text-yellow-600';
      case 'shipped': return 'text-purple-600';
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'cod_pending': return 'text-yellow-600';
      case 'pending': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Generate random order status for demo purposes
  const getRandomOrderStatus = (order) => {
    if (order.orderStatus && order.orderStatus !== 'processing') {
      return order.orderStatus;
    }
    
    const statuses = ['processing', 'confirmed', 'shipped', 'delivered'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  };

  // Generate random delivery date (3-7 days from now)
  const getRandomDeliveryDate = (order) => {
    if (order.deliveryDate) {
      try {
        const date = new Date(order.deliveryDate);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      } catch (err) {
        console.log('Invalid delivery date, generating random one');
      }
    }
    
    const daysFromNow = Math.floor(Math.random() * 5) + 3; // 3-7 days
    const deliveryDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
    return deliveryDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      
      
      {/* User Details Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">User Details</h3>
        {edit ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password (optional)</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="New Password"
                type="password"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Save
              </button>
              <button type="button" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50" onClick={() => setEdit(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <div><span className="font-medium">Name:</span> {user?.name}</div>
            <div><span className="font-medium">Email:</span> {user?.email}</div>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => setEdit(true)}>
              Edit Profile
            </button>
          </div>
        )}
        {msg && <div className="mt-2 text-green-600">{msg}</div>}
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">My Orders</h3>
          <div className="flex gap-2">
            <button 
              onClick={handleClearAllOrders}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Clear All Orders
            </button>
          <button 
            onClick={() => {
              const fetchOrders = async () => {
                if (!user?.token || !user?._id) {
                  return;
                }
                setLoading(true);
                try {
                  let userToken = user?.token;
                  if (!userToken) {
                    const savedUser = localStorage.getItem('user');
                    if (savedUser) {
                      const parsedUser = JSON.parse(savedUser);
                      userToken = parsedUser.token;
                    }
                  }
                  
                  const data = await api.getUserOrders(userToken, user._id);
                  setOrders(data.orders || []);
                  setMsg('Orders refreshed successfully!');
                  setTimeout(() => setMsg(''), 3000);
                } catch (err) {
                  setMsg('Failed to refresh orders');
                  setTimeout(() => setMsg(''), 3000);
                } finally {
                  setLoading(false);
                }
              };
              fetchOrders();
            }}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh Orders'}
          </button>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No orders found.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">Order #{order.orderNumber}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${getStatusColor(getRandomOrderStatus(order))}`}>
                      {getRandomOrderStatus(order).charAt(0).toUpperCase() + getRandomOrderStatus(order).slice(1)}
                    </div>
                    <div className={`text-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus === 'cod_pending' ? 'COD Pending' : 
                       order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </div>
                    <div className="text-xs mt-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {order.paymentMethod === 'cod' ? 'COD' : 
                       order.paymentMethod === 'razorpay' ? 'Online' : 
                       order.paymentMethod || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Order Items with Details */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Order Items:</h5>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium">{item.product?.name || 'Unknown Product'}</div>
                            <div className="text-sm text-gray-600">
                              Quantity: {item.quantity || 1} | Price per item: ₹{item.price || item.product?.price || 0}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">₹{((item.price || item.product?.price || 0) * (item.quantity || 1))}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Total Amount:</span>
                      <div className="font-bold text-lg">₹{order.totalAmount || order.items?.reduce((sum, item) => sum + ((item.price || item.product?.price || 0) * (item.quantity || 1)), 0) || 0}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Payment Method:</span>
                      <div className="capitalize font-semibold">
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 
                         order.paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 
                         order.paymentMethod || 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Delivery Date:</span>
                      <div>{getRandomDeliveryDate(order)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Order Status:</span>
                      <div className={`font-medium ${getStatusColor(getRandomOrderStatus(order))}`}>
                        {getRandomOrderStatus(order).charAt(0).toUpperCase() + getRandomOrderStatus(order).slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div className="bg-green-50 p-3 rounded-md">
                    <div className="font-medium text-gray-700 mb-1">Payment Details:</div>
                    <div className="text-sm">
                      <div className="flex justify-between items-center">
                        <span>Method:</span>
                        <span className="font-semibold">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 
                           order.paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 
                           order.paymentMethod || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span>Status:</span>
                        <span className={`font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus === 'cod_pending' ? 'COD Pending' : 
                           order.paymentStatus === 'paid' ? 'Paid' :
                           order.paymentStatus === 'pending' ? 'Pending' :
                           order.paymentStatus === 'failed' ? 'Failed' :
                           order.paymentStatus || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.address && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="font-medium text-gray-700 mb-1">Delivery Address:</div>
                      <div className="text-sm">
                        <div>{order.address.street}</div>
                        <div>{order.address.city}, {order.address.state} {order.address.postalCode}</div>
                        <div>{order.address.country}</div>
                      </div>
                    </div>
                  )}

                  {/* Cancellation Reason */}
                  {order.cancellationReason && (
                    <div className="bg-red-50 p-3 rounded-md">
                      <div className="font-medium text-red-700 mb-1">Cancellation Reason:</div>
                      <div className="text-sm text-red-600">{order.cancellationReason}</div>
                    </div>
                  )}
                </div>

                {/* Delete Order Button - Available for all orders except delivered */}
                {getRandomOrderStatus(order) !== 'delivered' && (
                  <div className="mt-3 pt-3 border-t">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingOrder === order._id}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {cancellingOrder === order._id ? 'Deleting...' : 'Delete Order'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All Products');

  // 1. ADD THIS useEffect to check for existing admin login
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    const adminToken = localStorage.getItem('adminToken');
    if (savedAdmin && adminToken) {
      const parsedAdmin = JSON.parse(savedAdmin);
      setUser({ ...parsedAdmin, role: 'admin', token: adminToken });
    } else {
      // Check for regular user login
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    }
  }, []);

  // Fetch cart from backend after login
  useEffect(() => {
    const fetchCart = async () => {
      if (user && user._id) {
        try {
          const res = await api.getCart(user._id, user.token);
          if (res.cart) {
            // Filter out items with null product references
            const cleanCartItems = res.cart.items.filter(item => item.product);
            setCart(cleanCartItems);
          } else {
            setCart([]);
          }
        } catch (err) {
          console.error('Error fetching cart:', err);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    };
    fetchCart();
  }, [user]);

  // Logout function
  const logout = () => {
    setUser(null);
    setCurrentPage('login');
    setCart([]);
    // Clear all stored data
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
  };

  // Add to cart using backend
  const addToCart = async (productId, quantity = 1) => {
    if (!user || !user._id) return;
    
    try {
    const res = await api.addToCart(user._id, productId, quantity, user.token);
    if (res.cart) {
      // Filter out items with null product references
      const cleanCartItems = res.cart.items.filter(item => item.product);
      setCart(cleanCartItems);
        console.log('Cart updated:', cleanCartItems);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Remove from cart using backend
  const removeFromCart = async (productId) => {
    if (!user || !user._id) {
      return;
    }
    
    if (!productId) {
      return;
    }
    
    const res = await api.removeFromCart(user._id, productId, user.token);
    
    if (res.cart) {
      // Filter out items with null product references
      const cleanCartItems = res.cart.items.filter(item => item.product);
      setCart(cleanCartItems);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user || !user._id) {
      return;
    }
    
    try {
      // Remove all items from cart one by one
      const cartItems = [...cart];
      for (const item of cartItems) {
        if (item.product) {
          const productId = typeof item.product === 'object' ? item.product._id : item.product;
          await api.removeFromCart(user._id, productId, user.token);
        }
      }
      setCart([]);
      console.log('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Refresh orders function
  const refreshOrders = async () => {
    // This will be called after successful order placement
    // Force a re-render of the dashboard to show new orders
    if (currentPage === 'dashboard') {
      // Trigger a small state change to force re-render
      setCurrentPage('dashboard');
    }
  };

  // On login, fetch cart
  const onLogin = (response) => {
    if (response.token || response.user) {
      const userData = response.user || { role: 'user', name: 'User' };
      // Add token to user data
      const userWithToken = {
        ...userData,
        token: response.token
      };
      setUser(userWithToken);
      // Save to localStorage for persistence
      if (userData.role === 'admin') {
        localStorage.setItem('admin', JSON.stringify(userWithToken));
        localStorage.setItem('adminToken', response.token || 'admin-demo-token');
        setCurrentPage('home'); // Keep admin on home page
      } else {
        localStorage.setItem('user', JSON.stringify(userWithToken));
        setCurrentPage('dashboard');
      }
    }
  };

  let pageComponent;
  if (currentPage === 'login') {
    pageComponent = <Login setCurrentPage={setCurrentPage} onLogin={onLogin} />;
  } else if (currentPage === 'signup') {
    pageComponent = <Signup setCurrentPage={setCurrentPage} onLogin={onLogin} />;
  } else if (currentPage === 'admin' && user && user.role === 'admin') {
    // Redirect to the proper admin dashboard route using Navigate
    pageComponent = <Navigate to="/admin/dashboard" replace />;
  } else if (currentPage === 'cart') {
    pageComponent = <Cart cart={cart} user={user} removeFromCart={removeFromCart} clearCart={clearCart} refreshOrders={refreshOrders} setCurrentPage={setCurrentPage} />;
  } else if (currentPage === 'dashboard') {
    pageComponent = <Dashboard user={user} setUser={setUser} refreshOrders={refreshOrders} />;
  } else {
    pageComponent = <Home search={search} user={user} addToCart={addToCart} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="*" element={
          <div>
            <AnnouncementBar />
            <Navbar
              search={search}
              setSearch={setSearch}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              user={user}
              logout={logout}
              cartItemCount={cart.length}
            />
            <CategoryNav 
              setSearch={setSearch}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            {pageComponent}
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold mb-4">Stay in the Loop</h3>
              <p className="text-lg mb-6 opacity-90">Get exclusive deals, new arrivals, and insider updates delivered to your inbox</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🛒</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ShopHub
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your ultimate destination for premium products. We bring you the best quality items with exceptional service and unbeatable prices.
              </p>
              <div className="flex gap-4">
                <button type="button" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <span className="text-lg">📘</span>
                </button>
                <button type="button" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <span className="text-lg">📸</span>
                </button>
                <button type="button" className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <span className="text-lg">🐦</span>
                </button>
                <button type="button" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <span className="text-lg">📺</span>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {['About Us', 'Contact', 'FAQ', 'Shipping Info', 'Returns', 'Size Guide'].map((link) => (
                  <li key={link}>
                    <button type="button" className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Categories</h4>
              <ul className="space-y-3">
                {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty'].map((category) => (
                  <li key={category}>
                    <button type="button" className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block">
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Customer Service</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-sm">📞</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Call Us</p>
                    <p className="text-white font-semibold">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-sm">✉️</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email Us</p>
                    <p className="text-white font-semibold">help@shophub.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-sm">💬</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Live Chat</p>
                    <p className="text-white font-semibold">24/7 Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Security Section */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-gray-400 text-sm mb-2">Secure Payments</p>
                  <div className="flex items-center gap-3">
                    <div className="bg-white rounded px-2 py-1">
                      <span className="text-blue-600 font-bold text-xs">VISA</span>
                    </div>
                    <div className="bg-white rounded px-2 py-1">
                      <span className="text-red-600 font-bold text-xs">MC</span>
                    </div>
                    <div className="bg-blue-600 rounded px-2 py-1">
                      <span className="text-white font-bold text-xs">RAZORPAY</span>
                    </div>
                    <div className="bg-green-600 rounded px-2 py-1">
                      <span className="text-white font-bold text-xs">UPI</span>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-gray-400 text-sm mb-2">Certifications</p>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-600 rounded px-2 py-1">
                      <span className="text-white text-xs font-semibold">🔒 SSL</span>
                    </div>
                    <div className="bg-blue-600 rounded px-2 py-1">
                      <span className="text-white text-xs font-semibold">✓ VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <p className="text-gray-400 text-sm mb-2">Download Our App</p>
                <div className="flex gap-3">
                  <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📱</span>
                      <div className="text-left">
                        <p className="text-xs text-gray-400">Download on the</p>
                        <p className="text-sm font-semibold text-white">App Store</p>
                      </div>
                    </div>
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🤖</span>
                      <div className="text-left">
                        <p className="text-xs text-gray-400">Get it on</p>
                        <p className="text-sm font-semibold text-white">Google Play</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © {currentYear} ShopHub. All rights reserved. Made with ❤️ for amazing shoppers.
                </p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <button type="button" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </button>
                <button type="button" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Terms of Service
                </button>
                <button type="button" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default App;
