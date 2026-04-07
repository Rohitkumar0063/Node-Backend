const jwt = require('jsonwebtoken');

// this middleware checks if the user has a valid token before letting them in
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // token must be in format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

module.exports = protect;
