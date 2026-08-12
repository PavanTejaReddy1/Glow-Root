const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middlewares/auth');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');
const { cloudinary: { uploadSingleImage } } = require('../config');

const router = express.Router();

router.get('/product/:productId', reviewController.getProductReviews);
router.get('/my-reviews', authenticate, reviewController.getUserReviews);
router.get('/pending', authenticateAdmin, authorize('reviews'), reviewController.getPendingReviews);
router.get('/all', authenticateAdmin, authorize('reviews'), reviewController.getAllReviews);
router.post('/', authenticate, uploadSingleImage(), reviewController.createReview);
router.patch('/:id/approve', authenticateAdmin, authorize('reviews'), reviewController.approveReview);
router.patch('/:id/reject', authenticateAdmin, authorize('reviews'), reviewController.rejectReview);
router.patch('/:id/status', authenticateAdmin, authorize('reviews'), reviewController.updateReviewStatus);
router.delete('/:id', authenticateAdmin, authorize('reviews'), reviewController.deleteReview);
router.post('/:id/helpful', reviewController.markHelpful);

module.exports = router;
