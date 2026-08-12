import { api } from './api';

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/api/v1/categories');
    return response.data;
  },

  // Get top-level categories
  getTopLevelCategories: async () => {
    const response = await api.get('/api/v1/categories/top-level');
    return response.data;
  },

  // Get featured categories
  getFeaturedCategories: async () => {
    const response = await api.get('/api/v1/categories/featured');
    return response.data;
  },

  // Get single category
  getCategory: async (id) => {
    const response = await api.get(`/api/v1/categories/${id}`);
    return response.data;
  },
};
