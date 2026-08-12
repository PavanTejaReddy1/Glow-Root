import { api } from './api';

export const cartService = {
  // Get cart
  getCart: async () => {
    const response = await api.get('/api/v1/cart');
    return response.data;
  },

  // Add to cart
  addItem: async (productId, quantity = 1, variant = null) => {
    const response = await api.post('/api/v1/cart', { productId, quantity, variant });
    return response.data;
  },

  // Add to cart (alias)
  addToCart: async (productId, quantity = 1, variant = null) => {
    const response = await api.post('/api/v1/cart', { productId, quantity, variant });
    return response.data;
  },

  // Update cart item
  updateCartItem: async (itemId, quantity) => {
    const response = await api.patch(`/api/v1/cart/${itemId}`, { quantity });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/api/v1/cart/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/api/v1/cart/clear');
    return response.data;
  },

  // Apply coupon
  applyCoupon: async (couponCode) => {
    const response = await api.post('/api/v1/cart/apply-coupon', { couponCode });
    return response.data;
  },

  // Remove coupon
  removeCoupon: async () => {
    const response = await api.delete('/api/v1/cart/coupon');
    return response.data;
  },

  // Move to wishlist
  moveToWishlist: async (itemId) => {
    const response = await api.post(`/api/v1/cart/${itemId}/move-to-wishlist`);
    return response.data;
  },
};
