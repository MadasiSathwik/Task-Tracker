export const TASK_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
};

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const TASK_CATEGORY = {
  TODO: 'Todo',
  DOING: 'Doing',
  UPCOMING: 'Upcoming',
};

export const STATUS_DETAILS = {
  [TASK_STATUS.PENDING]: { label: 'Pending', color: 'blue' },
  [TASK_STATUS.COMPLETED]: { label: 'Completed', color: 'success' },
};

export const PRIORITY_DETAILS = {
  [TASK_PRIORITY.LOW]: { label: 'Low', color: 'green' },
  [TASK_PRIORITY.MEDIUM]: { label: 'Medium', color: 'gold' },
  [TASK_PRIORITY.HIGH]: { label: 'High', color: 'red' },
};

export const CATEGORY_DETAILS = {
  [TASK_CATEGORY.TODO]: { label: 'To Do', color: 'blue' },
  [TASK_CATEGORY.DOING]: { label: 'Doing', color: 'orange' },
  [TASK_CATEGORY.UPCOMING]: { label: 'Upcoming', color: 'purple' },
};

export const API_ROUTES = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://task-tracker-backend-ht6s.onrender.com',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id) => `/tasks/${id}`,
  },
};
