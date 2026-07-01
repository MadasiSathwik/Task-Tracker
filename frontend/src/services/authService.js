import api from './api';
import { API_ROUTES } from '../utils/constants';

const authService = {
  /**
   * Log in user with credentials.
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Response data containing token and user profile
   */
  login: async (credentials) => {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Register a new user account.
   * @param {Object} userData - { username, email, password }
   * @returns {Promise<Object>} Response data containing token and user profile
   */
  register: async (userData) => {
    const response = await api.post(API_ROUTES.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Fetch details of currently authenticated user profile.
   * @returns {Promise<Object>} Current user data
   */
  getCurrentUser: async () => {
    const response = await api.get(API_ROUTES.AUTH.ME);
    return response.data;
  },
};

export default authService;
