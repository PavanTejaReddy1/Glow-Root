const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isLength({ min: 10, max: 10 }).withMessage('Valid phone number is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], asyncHandler(authController.register));

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], asyncHandler(authController.login));

router.post('/logout', authenticate, asyncHandler(authController.logout));

router.post('/refresh-token', asyncHandler(authController.refreshToken));

router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
], asyncHandler(authController.forgotPassword));

router.post('/reset-password/:token', [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], asyncHandler(authController.resetPassword));

router.get('/profile', authenticate, asyncHandler(authController.getProfile));

router.patch('/profile', authenticate, asyncHandler(authController.updateProfile));

router.patch('/change-password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
], asyncHandler(authController.changePassword));

router.delete('/account', authenticate, [
  body('password').notEmpty().withMessage('Password is required'),
], asyncHandler(authController.deleteAccount));

module.exports = router;
