import { api } from './api';

export const wishlistService = {
  // Get wishlist
  getWishlist: async () => {
    const response = await api.get('/api/v1/wishlist');
    return response.data;
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    const response = await api.post('/api/v1/wishlist', { productId });
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/api/v1/wishlist/${productId}`);
    return response.data;
  },

  // Move to cart
  moveToCart: async (productId) => {
    const response = await api.post(`/api/v1/wishlist/${productId}/move-to-cart`);
    return response.data;
  },

  // Clear wishlist
  clearWishlist: async () => {
    const response = await api.delete('/api/v1/wishlist');
    return response.data;
  },
};
