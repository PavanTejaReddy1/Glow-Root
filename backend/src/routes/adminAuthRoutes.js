const express = require('express');
const { body } = require('express-validator');
const adminAuthController = require('../controllers/adminAuthController');
const { authenticateAdmin } = require('../middlewares/adminAuth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], asyncHandler(adminAuthController.login));

router.post('/logout', authenticateAdmin, asyncHandler(adminAuthController.logout));

router.post('/refresh-token', asyncHandler(adminAuthController.refreshToken));

router.get('/profile', authenticateAdmin, asyncHandler(adminAuthController.getProfile));

router.patch('/profile', authenticateAdmin, asyncHandler(adminAuthController.updateProfile));

router.patch('/change-password', authenticateAdmin, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
], asyncHandler(adminAuthController.changePassword));

module.exports = router;
