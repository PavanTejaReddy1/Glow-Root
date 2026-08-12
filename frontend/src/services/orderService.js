import { api } from './api';

export const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post('/api/v1/orders', orderData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/api/v1/orders/verify-payment', paymentData);
    return response.data;
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await api.get('/api/v1/orders/my-orders');
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/api/v1/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id, reason) => {
    const response = await api.patch(`/api/v1/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Get all orders (admin) — backend route is /api/v1/orders (GET /)
  getAllOrders: async (params = {}) => {
    const response = await api.get('/api/v1/orders', { params });
    return response.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (id, statusData) => {
    const response = await api.patch(`/api/v1/orders/${id}/status`, statusData);
    return response.data;
  },
};
