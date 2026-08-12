const User = require('../models/User');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const { jwt, email } = require('../config');
const { UnauthorizedError, ConflictError, ValidationError, NotFoundError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const isProduction = process.env.NODE_ENV === 'production';

// Cross-site: frontend (glow-root-5z19.vercel.app) and backend (glow-root-rose.vercel.app)
// are different origins — cookies must use sameSite:'none' + secure:true in production
const cookieOpts = (maxAge) => ({
  httpOnly: true,
  secure:   isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path:     '/',
  maxAge,
});

const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, password } = req.body;

  const emailExists = await User.isEmailTaken(email);
  if (emailExists) throw new ConflictError('Email is already registered');

  if (phone) {
    const phoneExists = await User.isPhoneTaken(phone);
    if (phoneExists) throw new ConflictError('Phone number is already registered');
  }

  const userData = { firstName, email, password };
  if (lastName?.trim()) userData.lastName = lastName.trim();
  if (phone?.trim())    userData.phone    = phone.trim();

  const user = await User.create(userData);

  const accessToken  = jwt.generateAccessToken(user._id, 'user');
  const refreshToken = jwt.generateRefreshToken(user._id);

  await User.findByIdAndUpdate(user._id, { refreshToken });

  res.cookie('accessToken',  accessToken,  cookieOpts(15 * 60 * 1000));
  res.cookie('refreshToken', refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000));

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

  if (!user.isActive)  throw new UnauthorizedError('Your account has been deactivated. Please contact support.');
  if (user.isDeleted)  throw new UnauthorizedError('Your account has been deleted.');

  const accessToken  = jwt.generateAccessToken(user._id, 'user');
  const refreshToken = jwt.generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin    = new Date();
  await user.save();

  res.cookie('accessToken',  accessToken,  cookieOpts(15 * 60 * 1000));
  res.cookie('refreshToken', refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000));

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

  res.clearCookie('accessToken',  { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', path: '/' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', path: '/' });

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

  res.cookie('accessToken',  newAccessToken,  cookieOpts(15 * 60 * 1000));
  res.cookie('refreshToken', newRefreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000));

  res.status(200).json({
    status: 'success',
    data: {
      accessToken: newAccessToken,
    },
  });
});

/* ─── Helper: generate 6-digit OTP ─── */
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const OTP_EXPIRY_MINUTES = 10;

/* ─── User: Send OTP ─────────────────── */
const sendPasswordResetOtp = asyncHandler(async (req, res) => {
  const { email: userEmail } = req.body;
  if (!userEmail) throw new ValidationError('Email is required');

  const user = await User.findOne({ email: userEmail.toLowerCase().trim() });
  // Always respond success to prevent email enumeration
  if (!user || !user.isActive || user.isDeleted) {
    return res.status(200).json({ status: 'success', message: 'If this email exists, an OTP has been sent.' });
  }

  const otp     = generateOtp();
  const expires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await User.findByIdAndUpdate(user._id, {
    passwordResetOtp:          otp,
    passwordResetOtpExpires:   expires,
    passwordResetOtpVerified:  false,
  });

  await email.sendEmail({
    email: user.email,
    subject: 'Reset your GlowRoot password',
    from: `"GlowRoot" <${process.env.EMAIL_FROM}>`,
    replyTo: process.env.EMAIL_USER,
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#3A1F0D;padding:32px 40px;">
              <h1 style="margin:0;color:#F8F2E8;font-size:26px;font-weight:700;letter-spacing:1px;font-family:'Georgia',serif;">
                GlowRoot
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:20px;font-weight:600;">
                Password Reset Request
              </h2>
              <p style="margin:0 0 24px;color:#444444;font-size:15px;line-height:1.6;">
                Hi ${user.firstName},
              </p>
              <p style="margin:0 0 28px;color:#444444;font-size:15px;line-height:1.6;">
                We received a request to reset the password for your GlowRoot account.
              </p>
              <p style="margin:0 0 12px;color:#444444;font-size:15px;line-height:1.6;">
                Your password reset OTP is:
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:#F8F2E8;border:2px solid #C59B45;border-radius:8px;padding:20px 40px;">
                      <span style="font-size:40px;font-weight:700;letter-spacing:14px;color:#3A1F0D;font-family:'Courier New',monospace;">${otp}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 28px;color:#444444;font-size:15px;line-height:1.6;">
                This OTP will expire in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.
              </p>
              <p style="margin:0;color:#888888;font-size:14px;line-height:1.6;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #eeeeee;margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <p style="margin:0;color:#888888;font-size:13px;line-height:1.6;">
                Thanks,<br>
                <strong style="color:#555555;">GlowRoot Team</strong>
              </p>
            </td>
          </tr>

        </table>

        <!-- Sub-footer -->
        <p style="margin:20px 0 0;color:#aaaaaa;font-size:12px;text-align:center;">
          &copy; ${new Date().getFullYear()} GlowRoot. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });

  res.status(200).json({ status: 'success', message: 'OTP sent to your email address.' });
});

/* ─── User: Verify OTP + Reset Password ─ */
const verifyOtpAndResetPassword = asyncHandler(async (req, res) => {
  const { email: userEmail, otp, newPassword } = req.body;
  if (!userEmail || !otp || !newPassword) throw new ValidationError('Email, OTP and new password are required');
  if (newPassword.length < 8) throw new ValidationError('Password must be at least 8 characters');

  const user = await User.findOne({ email: userEmail.toLowerCase().trim() })
    .select('+passwordResetOtp +passwordResetOtpExpires +passwordResetOtpVerified +password');

  if (!user) throw new ValidationError('Invalid OTP or email');

  if (!user.passwordResetOtp || user.passwordResetOtp !== otp.trim())
    throw new ValidationError('Invalid OTP');

  if (!user.passwordResetOtpExpires || user.passwordResetOtpExpires < new Date())
    throw new ValidationError('OTP has expired. Please request a new one.');

  user.password                   = newPassword;
  user.passwordResetOtp           = undefined;
  user.passwordResetOtpExpires    = undefined;
  user.passwordResetOtpVerified   = undefined;
  user.passwordResetToken         = undefined;
  user.passwordResetExpires       = undefined;
  await user.save();

  res.status(200).json({ status: 'success', message: 'Password reset successful. Please login with your new password.' });
});

const forgotPassword = sendPasswordResetOtp; // keep old name for route compat

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

  res.clearCookie('accessToken',  { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', path: '/' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', path: '/' });

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
  sendPasswordResetOtp,
  verifyOtpAndResetPassword,
  resetPassword: verifyOtpAndResetPassword,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
