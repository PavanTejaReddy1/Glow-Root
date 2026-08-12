const express = require('express');
const { getPublicSettings, getAdminSettings, updateSettings } = require('../controllers/settingsController');
const { authenticateAdmin } = require('../middlewares/adminAuth');

const router = express.Router();

// Public — frontend reads announcement bar, hero stats, footer info
router.get('/', getPublicSettings);

// Admin only
router.get('/admin', authenticateAdmin, getAdminSettings);
router.put('/admin', authenticateAdmin, updateSettings);

module.exports = router;
