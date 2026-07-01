const mongoose = require('mongoose');
const { env } = require('./env');

const registerConnectionEvents = () => {
  mongoose.connection.on('error', (err) => {
    console.error('[Database] Connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] Disconnected from MongoDB');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[Database] Reconnected to MongoDB');
  });
};

const connectDatabase = async () => {
  if (!env.mongoUri) {
    const error = new Error(
      'MONGO_URI is not defined. Add it to your .env file.'
    );
    error.name = 'DatabaseConfigurationError';
    throw error;
  }

  mongoose.set('strictQuery', true);
  registerConnectionEvents();

  try {
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('[Database] Failed to connect:', error.message);
    throw error;
  }
};

const disconnectDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.connection.close();
  console.log('[Database] Connection closed');
};

module.exports = { connectDatabase, disconnectDatabase };
