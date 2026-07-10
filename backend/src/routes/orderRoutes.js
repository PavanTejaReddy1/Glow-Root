const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/auth');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', authenticateAdmin, authorize('orders'), asyncHandler(orderController.getOrders));
router.get('/dashboard-stats', authenticateAdmin, authorize('analytics'), asyncHandler(orderController.getDashboardStats));
router.get('/my-orders', authenticate, asyncHandler(orderController.getUserOrders));
router.get('/:id', authenticate, asyncHandler(orderController.getOrder));

router.post('/', authenticate, asyncHandler(orderController.createOrder));
router.post('/verify-payment', authenticate, asyncHandler(orderController.verifyPayment));
router.patch('/:id/status', authenticateAdmin, authorize('orders'), asyncHandler(orderController.updateOrderStatus));
router.patch('/:id/cancel', authenticate, asyncHandler(orderController.cancelOrder));
router.patch('/:id/tracking', authenticateAdmin, authorize('orders'), asyncHandler(orderController.updateTracking));

module.exports = router;
