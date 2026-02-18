
// 'err' parameter makes this an error handler, express automatically calls this when an error occurs
const errorHandler = (err, req, res, next) => {
  // logs error
  console.error('Error:', err.message);
  console.log('Error:', err.message);
  console.error('Stack:', err.stack);

  // defaults to 500 is no status is set
  const statusCode = err.statusCode || 500;

  // error response
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

export default errorHandler;