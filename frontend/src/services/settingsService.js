import { api } from './api.js';

export const settingsService = {
  // Public — used by Navbar, Hero, Footer, Testimonials
  getPublicSettings: async () => {
    const response = await api.get('/api/v1/settings');
    return response.data?.data?.settings || {};
  },

  // Admin — load settings form
  getAdminSettings: async () => {
    const response = await api.get('/api/v1/settings/admin');
    return response.data?.data?.settings || {};
  },

  // Admin — save settings form
  updateSettings: async (data) => {
    const response = await api.put('/api/v1/settings/admin', data);
    return response.data?.data?.settings || {};
  },
};
