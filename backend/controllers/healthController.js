const mongoose = require('mongoose');

const getHealth = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    success: true,
    message: 'Task Tracker API is running',
    timestamp: new Date().toISOString(),
    database: dbStatus[dbState] || 'unknown',
  });
};

module.exports = { getHealth };
