const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middlewares/auth');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');
const { uploadSingleImage } = require('../config');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/product/:productId', asyncHandler(reviewController.getProductReviews));
router.get('/my-reviews', authenticate, asyncHandler(reviewController.getUserReviews));
router.get('/pending', authenticateAdmin, authorize('reviews'), asyncHandler(reviewController.getPendingReviews));
router.post('/', authenticate, uploadSingleImage, asyncHandler(reviewController.createReview));
router.patch('/:id/approve', authenticateAdmin, authorize('reviews'), asyncHandler(reviewController.approveReview));
router.patch('/:id/reject', authenticateAdmin, authorize('reviews'), asyncHandler(reviewController.rejectReview));
router.delete('/:id', authenticateAdmin, authorize('reviews'), asyncHandler(reviewController.deleteReview));
router.post('/:id/helpful', asyncHandler(reviewController.markHelpful));

module.exports = router;
