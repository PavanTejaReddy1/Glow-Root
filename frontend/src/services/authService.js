import { api } from './api';

export const authService = {
  // Register
  register: async (userData) => {
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/api/v1/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/api/v1/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/api/v1/auth/refresh-token');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/api/v1/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post(`/api/v1/auth/reset-password/${token}`, { password });
    return response.data;
  },

  // Get profile
  getProfile: async () => {
    const response = await api.get('/api/v1/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.patch('/api/v1/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.patch('/api/v1/auth/change-password', passwordData);
    return response.data;
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await api.delete('/api/v1/auth/account', { data: { password } });
    return response.data;
  },
};
