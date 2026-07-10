const express = require('express');
const couponController = require('../controllers/couponController');
const { authenticate } = require('../middlewares/auth');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/active', asyncHandler(couponController.getActiveCoupons));
router.get('/', authenticateAdmin, authorize('coupons'), asyncHandler(couponController.getCoupons));
router.get('/:id', authenticateAdmin, authorize('coupons'), asyncHandler(couponController.getCoupon));
router.post('/validate', authenticate, asyncHandler(couponController.validateCoupon));
router.post('/', authenticateAdmin, authorize('coupons'), asyncHandler(couponController.createCoupon));
router.patch('/:id', authenticateAdmin, authorize('coupons'), asyncHandler(couponController.updateCoupon));
router.delete('/:id', authenticateAdmin, authorize('coupons'), asyncHandler(couponController.deleteCoupon));

module.exports = router;
