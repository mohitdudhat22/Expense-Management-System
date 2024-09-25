const errorHandler = () => (err, req, res, next) => {
  if (err && err.stack) {
      console.error(err.stack);
  } else {
      console.error('An error occurred, but no stack trace was available');
  }

  res.status(err && err.statusCode ? err.statusCode : 500).json({
      message: err && err.message ? err.message : 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? '🥞' : (err && err.stack ? err.stack : 'No stack trace available'),
  });
};

export default errorHandler;