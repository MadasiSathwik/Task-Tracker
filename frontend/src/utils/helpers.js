import { STATUS_DETAILS, PRIORITY_DETAILS } from './constants';

/**
 * Format a ISO date string into a readable format.
 * @param {string|Date} dateVal - Date to format
 * @param {boolean} includeTime - Whether to include hours/minutes
 * @returns {string} Formatted date
 */
export const formatDate = (dateVal, includeTime = false) => {
  if (!dateVal) return 'N/A';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Gets details for a task status.
 * @param {string} status - TASK_STATUS key
 * @returns {{label: string, color: string}} status info
 */
export const getStatusInfo = (status) => {
  return STATUS_DETAILS[status] || { label: status, color: 'default' };
};

/**
 * Gets details for a task priority.
 * @param {string} priority - TASK_PRIORITY key
 * @returns {{label: string, color: string}} priority info
 */
export const getPriorityInfo = (priority) => {
  return PRIORITY_DETAILS[priority] || { label: priority, color: 'default' };
};

/**
 * Truncate a string to a set character limit.
 * @param {string} text - text to truncate
 * @param {number} limit - maximum length
 * @returns {string} truncated text
 */
export const truncateText = (text, limit = 60) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return `${text.substring(0, limit)}...`;
};

/**
 * Calculates deadline countdown text and color
 * @param {string|Date} dueDate - task due date
 * @param {string} status - task status
 * @returns {{text: string, color: string}} countdown info
 */
export const getDeadlineCountdown = (dueDate, status) => {
  if (status === 'Completed') return { text: 'Completed', color: 'green' };
  if (!dueDate) return { text: 'No deadline', color: 'gray' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `❌ Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`, color: 'red' };
  } else if (diffDays === 0) {
    return { text: '⏰ Due Today', color: 'orange' };
  } else if (diffDays === 1) {
    return { text: '⏰ Due Tomorrow', color: 'blue' };
  } else {
    return { text: `⏰ ${diffDays} Days Left`, color: 'blue' };
  }
};
