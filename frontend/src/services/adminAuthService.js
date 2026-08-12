import { api } from './api.js';

export const adminAuthService = {
  login: async (credentials) => {
    const response = await api.post('/api/v1/admin/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/v1/admin/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/v1/admin/auth/profile');
    return response.data;
  }
};
