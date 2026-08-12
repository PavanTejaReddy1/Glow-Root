const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, cartController.getCart);
router.post('/', authenticate, cartController.addToCart);
// Specific routes MUST come before parameterised routes
router.post('/apply-coupon', authenticate, cartController.applyCoupon);
router.delete('/coupon', authenticate, cartController.removeCoupon);
router.delete('/clear', authenticate, cartController.clearCart);
// Parameterised routes
router.patch('/:itemId', authenticate, cartController.updateCartItem);
router.delete('/:itemId', authenticate, cartController.removeFromCart);
router.post('/:itemId/move-to-wishlist', authenticate, cartController.moveToWishlist);

module.exports = router;
