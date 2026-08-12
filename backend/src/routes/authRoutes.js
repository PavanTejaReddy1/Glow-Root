const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

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

router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isLength({ min: 10, max: 10 }).withMessage('Valid phone number is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], handleValidationErrors, authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], handleValidationErrors, authController.login);

router.post('/logout', authenticate, authController.logout);

router.post('/refresh-token', authController.refreshToken);

router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
], handleValidationErrors, authController.sendPasswordResetOtp);

router.post('/verify-otp-reset', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], handleValidationErrors, authController.verifyOtpAndResetPassword);

// Legacy link-based reset kept for backward compat
router.post('/reset-password/:token', [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], handleValidationErrors, authController.verifyOtpAndResetPassword);

router.get('/profile', authenticate, authController.getProfile);

router.patch('/profile', authenticate, authController.updateProfile);

router.patch('/change-password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
], handleValidationErrors, authController.changePassword);

router.delete('/account', authenticate, [
  body('password').notEmpty().withMessage('Password is required'),
], handleValidationErrors, authController.deleteAccount);

module.exports = router;
