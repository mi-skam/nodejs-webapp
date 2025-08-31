const morgan = require('morgan');
const { getPrismaClient } = require('../utils/database');

function createRequestLogger() {
  const prisma = getPrismaClient();

  const logRequest = async (_req, res, next) => {
    res.on('finish', async () => {
      try {
        await prisma.requestLog.create({
          data: {
            method: _req.method,
            path: _req.originalUrl,
            statusCode: res.statusCode,
            environment: process.env.NODE_ENV || 'development',
            expressVersion: require('express/package.json').version,
          },
        });
      } catch (error) {
        // Database logging is optional, don't break the app if it fails
        if (process.env.NODE_ENV !== 'test') {
          process.stderr.write(`Failed to log request to database: ${error.message}\n`);
        }
      }
    });

    next();
  };

  return logRequest;
}

const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms', {
  skip: () => process.env.NODE_ENV === 'test',
});

module.exports = {
  createRequestLogger,
  morganLogger,
};