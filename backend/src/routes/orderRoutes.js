const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/auth');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');

const router = express.Router();

router.get('/', authenticateAdmin, authorize('orders'), orderController.getOrders);
router.get('/dashboard-stats', authenticateAdmin, authorize('analytics'), orderController.getDashboardStats);
router.get('/my-orders', authenticate, orderController.getUserOrders);
router.get('/:id', authenticate, orderController.getOrder);

router.post('/', authenticate, orderController.createOrder);
router.post('/verify-payment', authenticate, orderController.verifyPayment);
router.patch('/:id/status', authenticateAdmin, authorize('orders'), orderController.updateOrderStatus);
router.patch('/:id/cancel', authenticate, orderController.cancelOrder);
router.patch('/:id/tracking', authenticateAdmin, authorize('orders'), orderController.updateTracking);

module.exports = router;
