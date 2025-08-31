const morgan = require('morgan');
const { getPrismaClient } = require('../utils/database');

function createRequestLogger() {
  const prisma = getPrismaClient();

  const logRequest = async (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', async () => {
      try {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        await prisma.requestLog.create({
          data: {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            environment: process.env.NODE_ENV || 'development',
            expressVersion: require('express/package.json').version,
          },
        });
      } catch (error) {
        console.error('Failed to log request to database:', error.message);
      }
    });

    next();
  };

  return logRequest;
}

const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms', {
  skip: (req) => process.env.NODE_ENV === 'test',
});

module.exports = {
  createRequestLogger,
  morganLogger,
};