const Admin = require('../models/Admin');
const { jwt } = require('../config');
const { UnauthorizedError, ConflictError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select('+password');
  
  if (!admin || !(await admin.comparePassword(password))) {
    throw new UnauthorizedError('Incorrect email or password');
  }

  if (!admin.isActive) {
    throw new UnauthorizedError('Your admin account has been deactivated. Please contact support.');
  }

  const accessToken = jwt.generateAccessToken(admin._id, 'admin');
  const refreshToken = jwt.generateRefreshToken(admin._id);

  admin.lastLogin = new Date();
  await admin.save();

  res.cookie('adminAccessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('adminRefreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Admin login successful',
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        avatar: admin.avatar,
      },
      accessToken,
    },
  });
});

const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('adminAccessToken');
  res.clearCookie('adminRefreshToken');

  res.status(200).json({
    status: 'success',
    message: 'Admin logout successful',
  });
});

const refreshToken = asyncHandler(async (req, res, next) => {
  const { adminRefreshToken } = req.cookies;

  if (!adminRefreshToken) {
    throw new UnauthorizedError('Refresh token not found. Please log in again.');
  }

  const decoded = jwt.verifyRefreshToken(adminRefreshToken);
  
  const admin = await Admin.findById(decoded.userId);
  
  if (!admin || !admin.isActive) {
    throw new UnauthorizedError('Invalid refresh token. Please log in again.');
  }

  const newAccessToken = jwt.generateAccessToken(admin._id, 'admin');
  const newRefreshToken = jwt.generateRefreshToken(admin._id);

  res.cookie('adminAccessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('adminRefreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    data: {
      accessToken: newAccessToken,
    },
  });
});

const getProfile = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.admin._id);

  res.status(200).json({
    status: 'success',
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        avatar: admin.avatar,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      },
    },
  });
});

const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, avatar } = req.body;

  const admin = await Admin.findById(req.admin._id);

  if (name) admin.name = name;
  if (avatar) admin.avatar = avatar;

  await admin.save();

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        avatar: admin.avatar,
      },
    },
  });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin._id).select('+password');

  if (!(await admin.comparePassword(currentPassword))) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  admin.password = newPassword;
  await admin.save();

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully',
  });
});

module.exports = {
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
};
