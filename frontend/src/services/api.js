import axios from 'axios';



/**

 * Centralized Axios instance.

 * Swap VITE_API_BASE_URL in .env to point at a live backend —

 * every call site (newsletter signup, product fetch, etc.)

 * stays unchanged.

 */

export const api = axios.create({

  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://glow-root-rose.vercel.app/api/v1',

  timeout: 10000,

  headers: { 'Content-Type': 'application/json' },

});



/** Subscribe an email to the newsletter list. */

export const subscribeNewsletter = async (email) => {

  // Replace with: return api.post('/newsletter/subscribe', { email });

  return new Promise((resolve) => {

    setTimeout(() => resolve({ data: { success: true, email } }), 600);

  });

};



/** Fetch full product catalog (falls back to local data in dev). */

export const fetchProducts = async () => {

  const { products } = await import('../data/products.js');

  return products;

};

