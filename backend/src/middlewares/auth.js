const { UnauthorizedError, ForbiddenError } = require('../utils/errorHandler');
const { verifyAccessToken } = require('../config');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers?.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('You are not logged in. Please log in to get access.');
    }

    const decoded = verifyAccessToken(token);
    
    const user = await User.findById(decoded.userId).select('+password +refreshToken');
    
    if (!user) {
      throw new UnauthorizedError('The user belonging to this token no longer exists.');
    }

    if (!user.isActive) {
      throw new ForbiddenError('Your account has been deactivated. Please contact support.');
    }

    if (user.isDeleted) {
      throw new UnauthorizedError('The user belonging to this token has been deleted.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers?.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);
      if (user && user.isActive && !user.isDeleted) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth,
};
