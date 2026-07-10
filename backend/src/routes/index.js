const express = require('express');
const authRoutes = require('./authRoutes');
const adminAuthRoutes = require('./adminAuthRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const cartRoutes = require('./cartRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const reviewRoutes = require('./reviewRoutes');
const couponRoutes = require('./couponRoutes');
const analyticsRoutes = require('./analyticsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
