const Admin = require('../models/Admin');
const { jwt, email: emailConfig } = require('../config');
const { UnauthorizedError, ConflictError, ValidationError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));
const OTP_EXPIRY_MINUTES = 10;

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

  res.cookie('adminAccessToken',  accessToken,  adminCookieOpts(15 * 60 * 1000));
  res.cookie('adminRefreshToken', refreshToken, adminCookieOpts(7 * 24 * 60 * 60 * 1000));

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
  res.clearCookie('adminAccessToken',  { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', path: '/' });
  res.clearCookie('adminRefreshToken', { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', path: '/' });

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

  res.cookie('adminAccessToken',  newAccessToken,  adminCookieOpts(15 * 60 * 1000));
  res.cookie('adminRefreshToken', newRefreshToken, adminCookieOpts(7 * 24 * 60 * 60 * 1000));

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

const sendAdminPasswordResetOtp = asyncHandler(async (req, res) => {
  // Admin email always comes from .env — don't accept it from the request body
  const adminEmail = process.env.ADMIN_EMAIL;
  const { email: requestedEmail } = req.body;

  if (!requestedEmail) throw new ValidationError('Email is required');

  // Security: only allow OTP for the configured admin email
  if (requestedEmail.toLowerCase().trim() !== adminEmail?.toLowerCase().trim()) {
    return res.status(200).json({ status: 'success', message: 'If this email exists, an OTP has been sent.' });
  }

  const admin = await Admin.findOne({ email: adminEmail.toLowerCase() });
  if (!admin || !admin.isActive) {
    return res.status(200).json({ status: 'success', message: 'If this email exists, an OTP has been sent.' });
  }

  const otp     = generateOtp();
  const expires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await Admin.findByIdAndUpdate(admin._id, {
    passwordResetOtp:         otp,
    passwordResetOtpExpires:  expires,
    passwordResetOtpVerified: false,
  });

  await emailConfig.sendEmail({
    email: admin.email,
    subject: 'Reset your GlowRoot admin password',
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
                GlowRoot Admin
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
                Hi ${admin.name},
              </p>
              <p style="margin:0 0 28px;color:#444444;font-size:15px;line-height:1.6;">
                We received a request to reset the password for your GlowRoot admin account.
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
                If you did not request a password reset, please secure your account immediately — someone may have access to this email address.
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

  res.status(200).json({ status: 'success', message: 'OTP sent to the registered admin email.' });
});

const verifyAdminOtpAndResetPassword = asyncHandler(async (req, res) => {
  const { email: requestedEmail, otp, newPassword } = req.body;
  if (!requestedEmail || !otp || !newPassword) throw new ValidationError('Email, OTP and new password are required');
  if (newPassword.length < 8) throw new ValidationError('Password must be at least 8 characters');

  const admin = await Admin.findOne({ email: requestedEmail.toLowerCase().trim() })
    .select('+password +passwordResetOtp +passwordResetOtpExpires');

  if (!admin) throw new ValidationError('Invalid OTP or email');
  if (!admin.passwordResetOtp || admin.passwordResetOtp !== otp.trim())
    throw new ValidationError('Invalid OTP');
  if (!admin.passwordResetOtpExpires || admin.passwordResetOtpExpires < new Date())
    throw new ValidationError('OTP has expired. Please request a new one.');

  admin.password                  = newPassword;
  admin.passwordResetOtp          = undefined;
  admin.passwordResetOtpExpires   = undefined;
  admin.passwordResetOtpVerified  = undefined;
  await admin.save();

  res.status(200).json({ status: 'success', message: 'Password reset successful. Please login with your new password.' });
});

module.exports = {
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  sendAdminPasswordResetOtp,
  verifyAdminOtpAndResetPassword,
};
