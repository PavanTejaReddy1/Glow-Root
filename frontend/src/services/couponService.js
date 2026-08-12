import { api } from './api.js';

export const couponService = {
  // Get all coupons (admin)
  getAllCoupons: async (params = {}) => {
    const response = await api.get('/api/v1/coupons', { params });
    // Backend: { status:'success', data:{ coupons, pagination } }
    // Return the whole axios response so caller can do response.data.data.coupons
    return response;
  },

  // Get single coupon by ID (admin)
  getCouponById: async (id) => {
    const response = await api.get(`/api/v1/coupons/${id}`);
    return response.data;
  },

  // Create new coupon (admin)
  createCoupon: async (couponData) => {
    const response = await api.post('/api/v1/coupons', couponData);
    return response;
  },

  // Update coupon (admin)
  updateCoupon: async (id, couponData) => {
    const response = await api.patch(`/api/v1/coupons/${id}`, couponData);
    return response;
  },

  // Delete coupon (admin)
  deleteCoupon: async (id) => {
    const response = await api.delete(`/api/v1/coupons/${id}`);
    return response;
  },

  // Validate coupon (user)
  validateCoupon: async (code, cartTotal) => {
    const response = await api.post('/api/v1/coupons/validate', { code, cartTotal });
    return response.data;
  },

  // Get active coupons (public — used in cart modal)
  getActiveCoupons: async () => {
    const response = await api.get('/api/v1/coupons/active');
    return response;
  },
};
