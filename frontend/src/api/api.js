import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set local network IP address so physical phones, emulators, and web can all connect
const API_BASE_URL = 'http://10.36.219.100:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.status, error.response.data?.message);
    } else if (error.request) {
      // No response received
      console.error('Network Error: No response from server');
    }
    return Promise.reject(error);
  }
);

// ======== AUTH API ========
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ======== SERVICES API ========
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  getCategories: () => api.get('/services/categories/list'),
};

// ======== BOOKINGS API ========
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

// ======== NOTIFICATIONS API ========
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// ======== SUPPORT API ========
export const supportAPI = {
  getFAQs: (params) => api.get('/support/faqs', { params }),
  getTips: () => api.get('/support/tips'),
};

export default api;
