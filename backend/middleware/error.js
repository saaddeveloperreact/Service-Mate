const errorHandler = (err, req, res, next) => {
  let status  = err.statusCode || 500;
  let message = err.message    || 'Server Error';

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    status  = 400;
  }
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(e => e.message).join(', ');
    status  = 400;
  }
  if (err.name === 'JsonWebTokenError') { message = 'Invalid token'; status = 401; }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
