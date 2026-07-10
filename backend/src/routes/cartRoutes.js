const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middlewares/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', authenticate, asyncHandler(cartController.getCart));
router.post('/', authenticate, asyncHandler(cartController.addToCart));
router.patch('/:itemId', authenticate, asyncHandler(cartController.updateCartItem));
router.delete('/:itemId', authenticate, asyncHandler(cartController.removeFromCart));
router.delete('/', authenticate, asyncHandler(cartController.clearCart));
router.post('/apply-coupon', authenticate, asyncHandler(cartController.applyCoupon));
router.delete('/coupon', authenticate, asyncHandler(cartController.removeCoupon));
router.post('/:itemId/move-to-wishlist', authenticate, asyncHandler(cartController.moveToWishlist));

module.exports = router;
