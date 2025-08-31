require('dotenv').config();
const app = require('./app');
const config = require('../config/app');
const { connectDatabase, disconnectDatabase } = require('./utils/database');

const server = app.listen(config.port, async () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📱 Environment: ${config.environment}`);
  console.log(`📡 Service: ${config.serviceName}`);
  
  try {
    await connectDatabase();
  } catch (error) {
    console.warn('⚠️ Starting without database connection');
  }
});

const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    try {
      await disconnectDatabase();
      console.log('Database disconnected');
    } catch (error) {
      console.error('Error disconnecting database:', error);
    }
    
    console.log('Graceful shutdown completed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Force exit after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;