// this is the global error handler — it catches any error thrown anywhere in the app
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // handle duplicate key errors from mongo (e.g. duplicate email)
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate value. This record already exists.' });
  }

  // handle invalid mongo object ids
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  // default to 500 for anything unknown
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Something went wrong on our end.',
  });
};

// small helper to create errors with a status code
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = { errorHandler, createError };
