const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.jwtAccessSecret);
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError('User not found', 401, 'UNAUTHORIZED');
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }
  next();
};

const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtAccessSecret);
    req.user = await User.findById(decoded.userId);
  } catch {
    // ignore invalid token for optional auth
  }
  next();
});

module.exports = { authenticate, authorize, optionalAuth };
