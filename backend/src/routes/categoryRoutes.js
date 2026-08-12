const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');
const { optionalAuth } = require('../middlewares/auth');
const { cloudinary: { uploadSingleImage } } = require('../config');

const router = express.Router();

/* ── Public ─────────────────────────────────────────────────────── */
router.get('/',           optionalAuth, categoryController.getCategories);
router.get('/top-level',  optionalAuth, categoryController.getTopLevelCategories);
router.get('/featured',   optionalAuth, categoryController.getFeaturedCategories);
router.get('/:id',        optionalAuth, categoryController.getCategory);

/* ── Admin — uploadSingleImage() returns [multer, normalise] ─────── */
router.post('/',
  authenticateAdmin, authorize('categories'),
  ...uploadSingleImage(),
  categoryController.createCategory,
);

router.patch('/:id',
  authenticateAdmin, authorize('categories'),
  ...uploadSingleImage(),
  categoryController.updateCategory,
);

router.delete('/:id',
  authenticateAdmin, authorize('categories'),
  categoryController.deleteCategory,
);

router.patch('/:id/restore',
  authenticateAdmin, authorize('categories'),
  categoryController.restoreCategory,
);

module.exports = router;
