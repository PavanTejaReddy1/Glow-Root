import { api } from './api';

export const productService = {
  // Admin: Get all products (no status filter)
  getAdminProducts: async (params = {}) => {
    const response = await api.get('/api/v1/products', { params: { limit: 200, ...params } });
    return response.data;
  },

  // Get all products (public, active only)
  getProducts: async (params = {}) => {
    const response = await api.get('/api/v1/products', { params });
    return response.data;
  },

  // Get single product by slug
  getProduct: async (slug) => {
    const response = await api.get(`/api/v1/products/slug/${slug}`);
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/api/v1/products/${id}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get('/api/v1/products/featured');
    return response.data;
  },

  // Get best sellers
  getBestSellers: async () => {
    const response = await api.get('/api/v1/products/best-sellers');
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async () => {
    const response = await api.get('/api/v1/products/new-arrivals');
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await api.get('/api/v1/products/search', { params: { q: query } });
    return response.data;
  },

  // Admin: Create product (FormData — let Axios set Content-Type + boundary automatically)
  createProduct: async (productData) => {
    const response = await api.post('/api/v1/products', productData);
    return response.data;
  },

  // Admin: Update product (FormData — let Axios set Content-Type + boundary automatically)
  updateProduct: async (id, productData) => {
    const response = await api.patch(`/api/v1/products/${id}`, productData);
    return response.data;
  },

  // Admin: Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/api/v1/products/${id}`);
    return response.data;
  },

  // Admin: Archive product
  archiveProduct: async (id) => {
    const response = await api.patch(`/api/v1/products/${id}/archive`);
    return response.data;
  },

  // Admin: Restore product
  restoreProduct: async (id) => {
    const response = await api.patch(`/api/v1/products/${id}/restore`);
    return response.data;
  },

  // Admin: Delete product image
  deleteProductImage: async (productId, imageId) => {
    const response = await api.delete(`/api/v1/products/${productId}/images/${imageId}`);
    return response.data;
  },

  // Admin: Set primary image
  setPrimaryImage: async (productId, imageId) => {
    const response = await api.patch(`/api/v1/products/${productId}/images/${imageId}/primary`);
    return response.data;
  },
};
