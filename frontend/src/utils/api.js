import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-auth-password': password
  },
});

// Set the auth header before each request
api.interceptors.request.use((config) => {
  const password = localStorage.getItem('password');
  if (password) {
    config.headers['x-auth-password'] = password;
  }
  return config;
});

export const timelineApi = {
  getAll: () => api.get('/timeline'),
  create: (data) => api.post('/timeline', data),
};

export const watchlistApi = {
  getAll: () => api.get('/watchlist'),
  create: (data) => api.post('/watchlist', data),
};

export const wishlistApi = {
  getAll: () => api.get('/wishlist'),
  create: (data) => api.post('/wishlist', data),
};

export default api;