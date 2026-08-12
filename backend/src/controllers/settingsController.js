const Settings = require('../models/Settings');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/v1/settings  — public (navbar, hero, footer need it)
const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();
  res.status(200).json({
    status: 'success',
    data: { settings },
  });
});

// GET /api/v1/admin/settings  — admin only
const getAdminSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();
  res.status(200).json({
    status: 'success',
    data: { settings },
  });
});

// PUT /api/v1/admin/settings  — admin only
const updateSettings = asyncHandler(async (req, res) => {
  const allowedFields = [
    'storeName', 'storeEmail', 'storePhone', 'storeAddress',
    'freeShippingAbove', 'shippingCharge', 'taxRate', 'currency',
    'instagramUrl', 'facebookUrl', 'twitterUrl', 'pinterestUrl',
    'heroTagline', 'heroSubtext',
    'announcementText', 'announcementEnabled',
    'heroStat1Value', 'heroStat1Label',
    'heroStat2Value', 'heroStat2Label',
    'heroStat3Value', 'heroStat3Label',
    'footerTagline', 'lowStockThreshold',
  ];

  const update = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) update[field] = req.body[field];
  });

  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: update },
    { new: true, upsert: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Settings updated successfully',
    data: { settings },
  });
});

module.exports = { getPublicSettings, getAdminSettings, updateSettings };
