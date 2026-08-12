const express = require('express');
const { body, validationResult } = require('express-validator');
const adminAuthController = require('../controllers/adminAuthController');
const { authenticateAdmin } = require('../middlewares/adminAuth');

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], handleValidationErrors, adminAuthController.login);

router.post('/logout', authenticateAdmin, adminAuthController.logout);

router.post('/refresh-token', adminAuthController.refreshToken);

router.get('/profile', authenticateAdmin, adminAuthController.getProfile);

router.patch('/profile', authenticateAdmin, adminAuthController.updateProfile);

router.patch('/change-password', authenticateAdmin, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
], handleValidationErrors, adminAuthController.changePassword);

// Forgot password — OTP sent to ADMIN_EMAIL from .env
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
], handleValidationErrors, adminAuthController.sendAdminPasswordResetOtp);

router.post('/verify-otp-reset', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], handleValidationErrors, adminAuthController.verifyAdminOtpAndResetPassword);

module.exports = router;
