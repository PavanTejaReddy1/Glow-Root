import { api } from './api';

export const reviewService = {
  // Get featured reviews for homepage testimonials
  getFeaturedReviews: async (limit = 8) => {
    const response = await api.get('/api/v1/reviews', { params: { status: 'approved', sort: '-helpful', limit } });
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    const response = await api.get(`/api/v1/reviews/product/${productId}`);
    return response.data;
  },

  // Get user reviews
  getUserReviews: async () => {
    const response = await api.get('/api/v1/reviews/my-reviews');
    return response.data;
  },

  // Get all reviews (admin)
  getAllReviews: async (params = {}) => {
    const response = await api.get('/api/v1/reviews/all', { params });
    return response.data;
  },

  // Create review
  createReview: async (productId, reviewData) => {
    // If images are provided as File objects, use FormData; otherwise use JSON
    const hasFileImages = reviewData.images && reviewData.images.some(img => img instanceof File);
    
    if (hasFileImages) {
      const formData = new FormData();
      formData.append('productId', productId);
      Object.keys(reviewData).forEach(key => {
        if (key === 'images') {
          reviewData.images.forEach(image => {
            if (image instanceof File) formData.append('images', image);
          });
        } else {
          formData.append(key, reviewData[key]);
        }
      });
      const response = await api.post('/api/v1/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } else {
      const response = await api.post('/api/v1/reviews', { productId, ...reviewData });
      return response.data;
    }
  },

  // Approve review (admin)
  approveReview: async (id) => {
    const response = await api.patch(`/api/v1/reviews/${id}/approve`);
    return response.data;
  },

  // Reject review (admin)
  rejectReview: async (id, reason) => {
    const response = await api.patch(`/api/v1/reviews/${id}/reject`, { reason });
    return response.data;
  },

  // Update review status (admin)
  updateReviewStatus: async (id, data) => {
    const response = await api.patch(`/api/v1/reviews/${id}/status`, data);
    return response.data;
  },

  // Delete review (admin)
  deleteReview: async (id) => {
    const response = await api.delete(`/api/v1/reviews/${id}`);
    return response.data;
  },

  // Mark review as helpful
  markHelpful: async (id) => {
    const response = await api.post(`/api/v1/reviews/${id}/helpful`);
    return response.data;
  },
};
