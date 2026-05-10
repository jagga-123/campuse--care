export function notFound(_req, res, _next) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: error.message || 'Server error'
  });
}
