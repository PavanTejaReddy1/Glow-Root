const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');
const { optionalAuth } = require('../middlewares/auth');
const { uploadSingleImage } = require('../config');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', optionalAuth, asyncHandler(categoryController.getCategories));
router.get('/top-level', optionalAuth, asyncHandler(categoryController.getTopLevelCategories));
router.get('/featured', optionalAuth, asyncHandler(categoryController.getFeaturedCategories));
router.get('/:id', optionalAuth, asyncHandler(categoryController.getCategory));

router.post('/', authenticateAdmin, authorize('categories'), uploadSingleImage, asyncHandler(categoryController.createCategory));
router.patch('/:id', authenticateAdmin, authorize('categories'), uploadSingleImage, asyncHandler(categoryController.updateCategory));
router.delete('/:id', authenticateAdmin, authorize('categories'), asyncHandler(categoryController.deleteCategory));
router.patch('/:id/restore', authenticateAdmin, authorize('categories'), asyncHandler(categoryController.restoreCategory));

module.exports = router;
