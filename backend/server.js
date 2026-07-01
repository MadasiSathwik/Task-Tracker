const app = require('./app');
const { env } = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/database');

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(env.port, () => {
      console.log(
        `Server running in ${env.nodeEnv} mode on port ${env.port}`
      );
    });

    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    if (error.name === 'DatabaseConfigurationError') {
      console.error('[Server] Configuration error:', error.message);
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error(
        '[Server] Could not reach MongoDB. Check that the server is running and MONGO_URI is correct.'
      );
    } else {
      console.error('[Server] Failed to start:', error.message);
    }
    process.exit(1);
  }
};

startServer();
