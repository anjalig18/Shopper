// Enhanced adminAPI.js for MongoDB integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data;
};

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
});

export const adminAPI = {
  // Dashboard and Analytics
  getDashboardStats: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  getAnalytics: async (params, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/analytics?${queryString}`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  // User Management
  getUsers: async (params = {}, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/users?${queryString}`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  getUserById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  createUser: async (userData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  updateUser: async (id, userData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  deleteUser: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  bulkUpdateUsers: async (userIds, updateData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/bulk-update`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ userIds, updateData })
    });
    return handleResponse(response);
  },

  // Product Management
  getProducts: async (params = {}, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/products?${queryString}`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  getProductById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  createProduct: async (productData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  updateProduct: async (id, productData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  deleteProduct: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  bulkUpdateProducts: async (productIds, updateData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/bulk-update`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ productIds, updateData })
    });
    return handleResponse(response);
  },

  updateProductStock: async (id, stock, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}/stock`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ stock })
    });
    return handleResponse(response);
  },

  // Order Management
  getOrders: async (params = {}, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/orders?${queryString}`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  getOrderById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (id, status, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  deleteOrder: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  // Category Management
  getCategories: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  createCategory: async (categoryData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(categoryData)
    });
    return handleResponse(response);
  },

  updateCategory: async (id, categoryData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(categoryData)
    });
    return handleResponse(response);
  },

  deleteCategory: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  // File Upload
  uploadImage: async (file, token) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });
    return handleResponse(response);
  },

  // Settings
  getSettings: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  updateSettings: async (settings, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(settings)
    });
    return handleResponse(response);
  },

  // Reports
  getReports: async (params = {}, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/reports?${queryString}`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  exportData: async (type, params = {}, token) => {
    const queryString = new URLSearchParams({ ...params, type }).toString();
    const response = await fetch(`${API_BASE_URL}/admin/export?${queryString}`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Export failed');
    }
    
    return response.blob();
  },

  // Real-time notifications (for WebSocket setup)
  connectWebSocket: (token, onMessage, onError, onClose) => {
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/admin/ws?token=${token}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };
    
    ws.onerror = onError;
    ws.onclose = onClose;
    
    return ws;
  }
};

// Enhanced auth API
export const adminAuthAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  refreshToken: async (refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    return handleResponse(response);
  },

  logout: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData, token) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  changePassword: async (passwordData, token) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(passwordData)
    });
    return handleResponse(response);
  }
};

// Utility functions for localStorage management
export const tokenManager = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('adminToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('adminRefreshToken', refreshToken);
    }
  },

  getAccessToken: () => localStorage.getItem('adminToken'),
  
  getRefreshToken: () => localStorage.getItem('adminRefreshToken'),
  
  clearTokens: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('admin');
  },

  isTokenExpired: (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
};

// API interceptor for automatic token refresh
export const setupAPIInterceptor = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (url, options = {}) => {
    let token = tokenManager.getAccessToken();
    
    // Check if token is expired and refresh if needed
    if (token && tokenManager.isTokenExpired(token)) {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await adminAuthAPI.refreshToken(refreshToken);
          tokenManager.setTokens(response.accessToken, response.refreshToken);
          token = response.accessToken;
          
          // Update authorization header
          if (options.headers && options.headers.Authorization) {
            options.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          // Refresh failed, redirect to login
          tokenManager.clearTokens();
          window.location.href = '/admin/login';
          return;
        }
      }
    }
    
    return originalFetch(url, options);
  };
};

export default adminAPI;