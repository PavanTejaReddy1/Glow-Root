const express = require('express');
const productController = require('../controllers/productController');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');
const { optionalAuth } = require('../middlewares/auth');
const { uploadProductImages } = require('../config');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', optionalAuth, asyncHandler(productController.getProducts));
router.get('/featured', optionalAuth, asyncHandler(productController.getFeaturedProducts));
router.get('/best-sellers', optionalAuth, asyncHandler(productController.getBestSellers));
router.get('/new-arrivals', optionalAuth, asyncHandler(productController.getNewArrivals));
router.get('/search', optionalAuth, asyncHandler(productController.searchProducts));
router.get('/:id', optionalAuth, asyncHandler(productController.getProduct));

router.post('/', authenticateAdmin, authorize('products'), uploadProductImages, asyncHandler(productController.createProduct));
router.patch('/:id', authenticateAdmin, authorize('products'), uploadProductImages, asyncHandler(productController.updateProduct));
router.delete('/:id', authenticateAdmin, authorize('products'), asyncHandler(productController.deleteProduct));
router.patch('/:id/archive', authenticateAdmin, authorize('products'), asyncHandler(productController.archiveProduct));
router.patch('/:id/restore', authenticateAdmin, authorize('products'), asyncHandler(productController.restoreProduct));
router.delete('/:id/images/:imageId', authenticateAdmin, authorize('products'), asyncHandler(productController.deleteProductImage));
router.patch('/:id/images/:imageId/primary', authenticateAdmin, authorize('products'), asyncHandler(productController.setPrimaryImage));

module.exports = router;
