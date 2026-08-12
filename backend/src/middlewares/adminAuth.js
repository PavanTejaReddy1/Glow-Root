const { UnauthorizedError, ForbiddenError } = require('../utils/errorHandler');
const { jwt } = require('../config');
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.adminAccessToken) {
      token = req.cookies.adminAccessToken;
    } else if (req.headers?.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('You are not logged in. Please log in to get access.');
    }

    const decoded = jwt.verifyAccessToken(token);
    
    const admin = await Admin.findById(decoded.userId).select('+password');
    
    if (!admin) {
      throw new UnauthorizedError('The admin belonging to this token no longer exists.');
    }

    if (!admin.isActive) {
      throw new ForbiddenError('Your admin account has been deactivated. Please contact support.');
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...permissions) => {
  return (req, res, next) => {
    try {
      if (!req.admin) {
        throw new UnauthorizedError('You are not authorized to perform this action.');
      }

      if (req.admin.role === 'superadmin') {
        return next();
      }

      if (permissions.length > 0) {
        const hasPermission = permissions.some(permission => 
          req.admin.permissions.includes(permission)
        );

        if (!hasPermission) {
          throw new ForbiddenError('You do not have permission to perform this action.');
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const requireSuperAdmin = (req, res, next) => {
  try {
    if (!req.admin || req.admin.role !== 'superadmin') {
      throw new ForbiddenError('This action requires superadmin privileges.');
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateAdmin,
  authorize,
  requireSuperAdmin,
};
