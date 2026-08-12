const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');

const router = express.Router();

router.get('/dashboard', authenticateAdmin, authorize('analytics'), analyticsController.getDashboardStats);
router.get('/revenue', authenticateAdmin, authorize('analytics'), analyticsController.getRevenueChart);
router.get('/sales', authenticateAdmin, authorize('analytics'), analyticsController.getSalesChart);
router.get('/customer-growth', authenticateAdmin, authorize('analytics'), analyticsController.getCustomerGrowth);
router.get('/order-status', authenticateAdmin, authorize('analytics'), analyticsController.getOrderStatusDistribution);
router.get('/category-performance', authenticateAdmin, authorize('analytics'), analyticsController.getCategoryPerformance);
router.get('/', authenticateAdmin, authorize('analytics'), analyticsController.getAnalyticsData);

module.exports = router;
