function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err.message);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Email already exists',
    });
  }

  res.status(500).json({
    error: 'Internal server error',
  });
}

module.exports = errorHandler;
