const express = require('express');
const productController = require('../controllers/productController');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');
const { optionalAuth } = require('../middlewares/auth');
const { cloudinary: { uploadProductImages } } = require('../config');

const router = express.Router();

/* ── Public routes ──────────────────────────────────────────────── */
router.get('/',             optionalAuth, productController.getProducts);
router.get('/featured',     optionalAuth, productController.getFeaturedProducts);
router.get('/best-sellers', optionalAuth, productController.getBestSellers);
router.get('/new-arrivals', optionalAuth, productController.getNewArrivals);
router.get('/search',       optionalAuth, productController.searchProducts);
router.get('/slug/:slug',   optionalAuth, productController.getProductBySlug);
router.get('/:id',          optionalAuth, productController.getProduct);

/* ── Admin routes — uploadProductImages() returns [multer, normalise] */
router.post('/',
  authenticateAdmin, authorize('products'),
  ...uploadProductImages(),
  productController.createProduct,
);

router.patch('/:id',
  authenticateAdmin, authorize('products'),
  ...uploadProductImages(),
  productController.updateProduct,
);

router.delete('/:id',
  authenticateAdmin, authorize('products'),
  productController.deleteProduct,
);

router.patch('/:id/archive',
  authenticateAdmin, authorize('products'),
  productController.archiveProduct,
);

router.patch('/:id/restore',
  authenticateAdmin, authorize('products'),
  productController.restoreProduct,
);

router.delete('/:id/images/:imageId',
  authenticateAdmin, authorize('products'),
  productController.deleteProductImage,
);

router.patch('/:id/images/:imageId/primary',
  authenticateAdmin, authorize('products'),
  productController.setPrimaryImage,
);

module.exports = router;
