import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://task-tracker-backend-ht6s.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});


// Request Interceptor to inject JWT token if it exists in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to clear storage on authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch all tasks (supports query filters)
 * @param {Object} [params] - Query filters (status, priority, search)
 */
export const getTasks = async (params = {}) => {
  const response = await api.get('/tasks', { params });
  return response.data;
};

/**
 * Fetch a single task by ID
 * @param {string} id - Task ID
 */
export const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

/**
 * Create a new task
 * @param {Object} taskData - Task payload
 */
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

/**
 * Update an existing task
 * @param {string} id - Task ID
 * @param {Object} taskData - Fields to update
 */
export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

/**
 * Delete a task by ID
 * @param {string} id - Task ID
 */
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export default api;
