import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dwh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('dwh_token');
      localStorage.removeItem('dwh_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// API helpers
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  update: (data) => api.put('/cart/update', data),
  remove: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clear: () => api.delete('/cart/clear'),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  toggle: (productId) => api.post('/wishlist/toggle', { productId }),
};

export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  myOrders: () => api.get('/orders/myorders'),
  getOne: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
};

export const reviewsAPI = {
  add: (productId, data) => api.post(`/reviews/${productId}`, data),
  delete: (productId, reviewId) => api.delete(`/reviews/${productId}/${reviewId}`),
};

export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard'),
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getUsers: () => api.get('/users'),
  toggleUser: (id) => api.put(`/users/${id}/toggle`),
};
