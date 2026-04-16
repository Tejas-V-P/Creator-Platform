const errorHandler = (err, req, res, next) => {
  // Log the actual error for server-side debugging
  console.error(err.stack); 

  // Send a consistent JSON response to the frontend
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

export default errorHandler;