const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, wishlistController.getWishlist);
router.post('/', authenticate, wishlistController.addToWishlist);
router.delete('/:productId', authenticate, wishlistController.removeFromWishlist);
router.post('/:productId/move-to-cart', authenticate, wishlistController.moveToCart);
router.delete('/', authenticate, wishlistController.clearWishlist);

module.exports = router;
