const User = require('../models/User');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const { jwt, email } = require('../config');
const { UnauthorizedError, ConflictError, ValidationError, NotFoundError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, password } = req.body;

  const emailExists = await User.isEmailTaken(email);
  if (emailExists) {
    throw new ConflictError('Email is already registered');
  }

  const phoneExists = await User.isPhoneTaken(phone);
  if (phoneExists) {
    throw new ConflictError('Phone number is already registered');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
  });

  const accessToken = jwt.generateAccessToken(user._id, 'user');
  const refreshToken = jwt.generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
    },
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError('Incorrect email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Your account has been deactivated. Please contact support.');
  }

  if (user.isDeleted) {
    throw new UnauthorizedError('Your account has been deleted.');
  }

  const accessToken = jwt.generateAccessToken(user._id, 'user');
  const refreshToken = jwt.generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
    },
  });
});

const logout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    status: 'success',
    message: 'Logout successful',
  });
});

const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token not found. Please log in again.');
  }

  const decoded = jwt.verifyRefreshToken(refreshToken);
  
  const user = await User.findById(decoded.userId).select('+refreshToken');
  
  if (!user || user.refreshToken !== refreshToken) {
    throw new UnauthorizedError('Invalid refresh token. Please log in again.');
  }

  if (!user.isActive || user.isDeleted) {
    throw new UnauthorizedError('User account is inactive or deleted.');
  }

  const newAccessToken = jwt.generateAccessToken(user._id, 'user');
  const newRefreshToken = jwt.generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', newRefreshToken, {
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

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  
  if (!user) {
    throw new NotFoundError('No user found with this email address');
  }

  const resetToken = jwt.generatePasswordResetToken(user._id);
  
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await email.sendEmail({
      email: user.email,
      subject: 'Password Reset Request - GlowRoot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4B2F1F;">Password Reset Request</h2>
          <p>Hello ${user.firstName},</p>
          <p>We received a request to reset your password. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #C59B45 0%, #A8771E 100%); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>GlowRoot Team</p>
        </div>
      `,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    throw new Error('Failed to send email. Please try again later.');
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const decoded = jwt.verifyResetToken(token);
  
  const user = await User.findById(decoded.userId).select('+passwordResetToken +passwordResetExpires');
  
  if (!user || !user.passwordResetToken || user.passwordResetToken !== token) {
    throw new UnauthorizedError('Invalid or expired reset token');
  }

  if (user.passwordResetExpires < new Date()) {
    throw new UnauthorizedError('Reset token has expired');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password reset successful. Please login with your new password.',
  });
});

const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        addresses: user.addresses,
        createdAt: user.createdAt,
      },
    },
  });
});

const updateProfile = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, phone, avatar } = req.body;

  const user = await User.findById(req.user._id);

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) {
    const phoneExists = await User.isPhoneTaken(phone, user._id);
    if (phoneExists) {
      throw new ConflictError('Phone number is already registered');
    }
    user.phone = phone;
  }
  if (avatar) user.avatar = avatar;

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    },
  });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully',
  });
});

const deleteAccount = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(password))) {
    throw new UnauthorizedError('Password is incorrect');
  }

  user.isDeleted = true;
  user.deletedAt = new Date();
  user.isActive = false;
  await user.save();

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully',
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
