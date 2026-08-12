const express = require('express');
const couponController = require('../controllers/couponController');
const { authenticate } = require('../middlewares/auth');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');

const router = express.Router();

router.get('/active', couponController.getActiveCoupons);
router.get('/', authenticateAdmin, authorize('coupons'), couponController.getCoupons);
router.get('/:id', authenticateAdmin, authorize('coupons'), couponController.getCoupon);
router.post('/validate', authenticate, couponController.validateCoupon);
router.post('/', authenticateAdmin, authorize('coupons'), couponController.createCoupon);
router.patch('/:id', authenticateAdmin, authorize('coupons'), couponController.updateCoupon);
router.delete('/:id', authenticateAdmin, authorize('coupons'), couponController.deleteCoupon);

module.exports = router;
