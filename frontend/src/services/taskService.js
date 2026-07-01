import api from './api';
import { API_ROUTES } from '../utils/constants';

const taskService = {
  /**
   * Fetch tasks with optional query filters (status, priority, search).
   * @param {Object} [params] - Optional query parameters
   * @returns {Promise<Array>} List of tasks
   */
  getTasks: async (params = {}) => {
    const response = await api.get(API_ROUTES.TASKS.BASE, { params });
    return response.data;
  },

  /**
   * Fetch a single task by ID.
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Task details
   */
  getTaskById: async (id) => {
    const response = await api.get(API_ROUTES.TASKS.BY_ID(id));
    return response.data;
  },

  /**
   * Create a new task.
   * @param {Object} taskData - { title, description, status, priority, dueDate }
   * @returns {Promise<Object>} Created task object
   */
  createTask: async (taskData) => {
    const response = await api.post(API_ROUTES.TASKS.BASE, taskData);
    return response.data;
  },

  /**
   * Update an existing task.
   * @param {string} id - Task ID to update
   * @param {Object} taskData - Update fields
   * @returns {Promise<Object>} Updated task object
   */
  updateTask: async (id, taskData) => {
    const response = await api.put(API_ROUTES.TASKS.BY_ID(id), taskData);
    return response.data;
  },

  /**
   * Delete a task.
   * @param {string} id - Task ID to delete
   * @returns {Promise<Object>} Server delete response
   */
  deleteTask: async (id) => {
    const response = await api.delete(API_ROUTES.TASKS.BY_ID(id));
    return response.data;
  },
};

export default taskService;
