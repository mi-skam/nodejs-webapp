const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    process.stderr.write(`Error: ${err.message}\n${err.stack}\n`);
  }

  if (res.headersSent) {
    return next(err);
  }

  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  const errorResponse = {
    error: {
      message,
      status: statusCode,
    },
  };

  if (isDevelopment) {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = err;
  }

  res.status(statusCode).json(errorResponse);
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      message: 'Not Found',
      status: 404,
      path: req.originalUrl,
    },
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};