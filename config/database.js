require('dotenv').config();

const config = {
  development: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nodejs_webapp_db',
  },
  test: {
    url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nodejs_webapp_db_test',
  },
  production: {
    url: process.env.DATABASE_URL,
  },
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];