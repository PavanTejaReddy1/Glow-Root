const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/dashboard', authenticateAdmin, authorize('analytics'), asyncHandler(analyticsController.getDashboardStats));
router.get('/revenue', authenticateAdmin, authorize('analytics'), asyncHandler(analyticsController.getRevenueChart));
router.get('/sales', authenticateAdmin, authorize('analytics'), asyncHandler(analyticsController.getSalesChart));
router.get('/customer-growth', authenticateAdmin, authorize('analytics'), asyncHandler(analyticsController.getCustomerGrowth));
router.get('/order-status', authenticateAdmin, authorize('analytics'), asyncHandler(analyticsController.getOrderStatusDistribution));
router.get('/category-performance', authenticateAdmin, authorize('analytics'), asyncHandler(analyticsController.getCategoryPerformance));

module.exports = router;
