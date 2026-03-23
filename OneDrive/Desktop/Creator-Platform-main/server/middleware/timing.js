const timingMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.log(`🐌 SLOW: ${req.method} ${req.path} - ${duration}ms`);
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`${req.method} ${req.path} - ${duration}ms`);
    }
  });
  next();
};
export default timingMiddleware;