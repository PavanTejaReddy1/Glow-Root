const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const { authenticate } = require('../middlewares/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', authenticate, asyncHandler(wishlistController.getWishlist));
router.post('/', authenticate, asyncHandler(wishlistController.addToWishlist));
router.delete('/:productId', authenticate, asyncHandler(wishlistController.removeFromWishlist));
router.post('/:productId/move-to-cart', authenticate, asyncHandler(wishlistController.moveToCart));
router.delete('/', authenticate, asyncHandler(wishlistController.clearWishlist));

module.exports = router;
