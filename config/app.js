require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  serviceName: process.env.SERVICE_NAME || 'nodejs-webapp',
  environment: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nodejs_webapp_db',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
};

module.exports = config;