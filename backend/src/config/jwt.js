const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
};

const generateEmailVerificationToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_EMAIL_SECRET,
    { expiresIn: process.env.JWT_EMAIL_EXPIRY || '1d' }
  );
};

const generatePasswordResetToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_RESET_SECRET,
    { expiresIn: process.env.JWT_RESET_EXPIRY || '1h' }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const verifyEmailToken = (token) => {
  return jwt.verify(token, process.env.JWT_EMAIL_SECRET);
};

const verifyResetToken = (token) => {
  return jwt.verify(token, process.env.JWT_RESET_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyEmailToken,
  verifyResetToken,
};
