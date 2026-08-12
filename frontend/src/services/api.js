import axios from 'axios';

/**
 * Centralized Axios instance.
 * Swap VITE_API_BASE_URL in .env to point at a live backend —
 * every call site (newsletter signup, product fetch, etc.)
 * stays unchanged.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://glow-root-rose.vercel.app',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor — auto-remove Content-Type for FormData so browser sets correct multipart boundary
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const url = originalRequest.url || '';
      const isAdminRoute = url.includes('/api/v1/admin') || url.includes('/api/v1/coupons') ||
                           url.includes('/api/v1/analytics') || url.includes('/api/v1/products') ||
                           url.includes('/api/v1/categories') || url.includes('/api/v1/reviews') ||
                           url.includes('/api/v1/orders') || url.includes('/api/v1/settings/admin');
      const isAuthCheck  = url.includes('/auth/profile');

      // For auth checks, just reject — don't loop
      if (isAuthCheck) return Promise.reject(error);

      const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://glow-root-rose.vercel.app';

      if (isAdminRoute) {
        // Try admin token refresh
        try {
          await axios.post(`${baseURL}/api/v1/admin/auth/refresh-token`, {}, { withCredentials: true, timeout: 10000 });
          return api(originalRequest);
        } catch {
          if (!window.location.pathname.includes('/admin/login')) {
            window.location.href = '/admin/login';
          }
          return Promise.reject(error);
        }
      }

      // User routes — try user token refresh
      const authenticatedEndpoints = ['/cart', '/orders', '/profile', '/wishlist', '/checkout'];
      const isUserAuth = authenticatedEndpoints.some(e => url.includes(e));
      if (!isUserAuth) return Promise.reject(error);

      try {
        await axios.post(`${baseURL}/api/v1/auth/refresh-token`, {}, { withCredentials: true, timeout: 10000 });
        return api(originalRequest);
      } catch {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

/** Subscribe an email to the newsletter list. */
export const subscribeNewsletter = async (email) => {
  return api.post('/newsletter/subscribe', { email });
};
