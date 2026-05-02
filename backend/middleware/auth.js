const jwt = require('jsonwebtoken');
const { error } = require('../utils/handler');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json(error(401, "Access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key_123");
    req.user = decoded; // { userId, email }
    next();
  } catch (err) {
    // Return 401 for invalid or expired tokens
    return res.status(401).json(error(401, "Invalid or expired token"));
  }
};

module.exports = authMiddleware;