const { UnauthorizedError, ForbiddenError } = require('../utils/errorHandler');
const { jwt } = require('../config');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    console.log('Authenticate middleware called');
    console.log('Cookies:', req.cookies);
    console.log('Authorization header:', req.headers?.authorization);
    
    let token;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
      console.log('Token from cookies:', token ? 'found' : 'not found');
    } else if (req.headers?.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token from header:', token ? 'found' : 'not found');
    }

    if (!token) {
      console.log('No token found, throwing UnauthorizedError');
      throw new UnauthorizedError('You are not logged in. Please log in to get access.');
    }

    const decoded = jwt.verifyAccessToken(token);
    console.log('Token decoded:', decoded.userId);
    
    const user = await User.findById(decoded.userId).select('+password +refreshToken');
    console.log('User found:', !!user);
    
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
    console.log('User authenticated successfully');
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
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
      const decoded = jwt.verifyAccessToken(token);
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
