const { isProduction } = require('../config/env');

/**
 * Global error handler — must be registered after all routes.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors;

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid task ID format';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (statusCode >= 500) {
    console.error(`[${req.method}] ${req.originalUrl}`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
