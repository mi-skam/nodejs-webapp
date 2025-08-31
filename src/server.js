require('dotenv').config();
const app = require('./app');
const config = require('../config/app');
const { connectDatabase, disconnectDatabase } = require('./utils/database');

const server = app.listen(config.port, async () => {
  if (process.env.NODE_ENV !== 'test') {
    process.stdout.write(`🚀 Server running on port ${config.port}\n`);
    process.stdout.write(`📱 Environment: ${config.environment}\n`);
    process.stdout.write(`📡 Service: ${config.serviceName}\n`);
  }
  
  try {
    await connectDatabase();
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      process.stderr.write('⚠️ Starting without database connection\n');
    }
  }
});

const gracefulShutdown = async (signal) => {
  if (process.env.NODE_ENV !== 'test') {
    process.stdout.write(`\n${signal} received. Starting graceful shutdown...\n`);
  }
  
  server.close(async () => {
    if (process.env.NODE_ENV !== 'test') {
      process.stdout.write('HTTP server closed\n');
    }
    
    try {
      await disconnectDatabase();
      if (process.env.NODE_ENV !== 'test') {
        process.stdout.write('Database disconnected\n');
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        process.stderr.write(`Error disconnecting database: ${error.message}\n`);
      }
    }
    
    if (process.env.NODE_ENV !== 'test') {
      process.stdout.write('Graceful shutdown completed\n');
    }
    process.exit(0);
  });

  setTimeout(() => {
    if (process.env.NODE_ENV !== 'test') {
      process.stderr.write('Force exit after timeout\n');
    }
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;