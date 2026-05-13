import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

/**
 * Request interceptor that attaches the Clerk session token
 * to every outgoing API request as a Bearer token.
 * Uses window.Clerk to get the token asynchronously.
 */
api.interceptors.request.use(
  async (config) => {
    try {
      // Clerk attaches itself to window after initialization
      if (window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Failed to get Clerk token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;