import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Constants from 'expo-constants';

import { Platform } from 'react-native';

// Dynamically resolve local computer IP from Expo Constants with fallback
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    '';

  let rawHost = hostUri ? hostUri.split(':')[0] : '';

  // If running on Android simulator where host is localhost or 127.0.0.1
  if (rawHost === 'localhost' || rawHost === '127.0.0.1' || !rawHost) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api';
    }
    if (Platform.OS === 'ios') {
      return 'http://localhost:5000/api';
    }
    // Default fallback to computer's local Wi-Fi IP for physical phone
    rawHost = '10.36.219.100';
  }

  // If tunnel host is detected (e.g. ngrok / exp.direct), fallback to local Wi-Fi IP
  if (rawHost.includes('ngrok') || rawHost.includes('exp.direct')) {
    rawHost = '10.36.219.100';
  }

  return `http://${rawHost}:5000/api`;
};

const API_BASE_URL = getBaseUrl();
console.log('📡 API Base URL resolved to:', API_BASE_URL);

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

// ======== ADMIN API ========
export const adminAPI = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),

  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Bookings
  getBookings: (params) => api.get('/admin/bookings', { params }),
  getBookingById: (id) => api.get(`/admin/bookings/${id}`),
  updateBooking: (id, data) => api.put(`/admin/bookings/${id}`, data),

  // Services
  getServices: () => api.get('/admin/services'),
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
};

export default api;
