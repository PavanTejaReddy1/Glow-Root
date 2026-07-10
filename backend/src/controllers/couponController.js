const Coupon = require('../models/Coupon');
const { NotFoundError, ConflictError, ValidationError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const createCoupon = asyncHandler(async (req, res, next) => {
  const {
    code,
    description,
    type,
    value,
    minimumOrder,
    maximumDiscount,
    usageLimit,
    perUserLimit,
    validFrom,
    validUntil,
    applicableCategories,
    applicableProducts,
    excludedProducts,
    isActive,
  } = req.body;

  const existingCoupon = await Coupon.findOne({ code });
  if (existingCoupon) {
    throw new ConflictError('Coupon code already exists');
  }

  const coupon = await Coupon.create({
    code,
    description,
    type,
    value,
    minimumOrder,
    maximumDiscount,
    usageLimit,
    perUserLimit,
    validFrom,
    validUntil,
    applicableCategories,
    applicableProducts,
    excludedProducts,
    isActive,
    createdBy: req.admin._id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Coupon created successfully',
    data: { coupon },
  });
});

const getCoupons = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status, search } = req.query;

  const query = { isDeleted: false };

  if (status === 'active') {
    query.isActive = true;
    const now = new Date();
    query.validFrom = { $lte: now };
    query.validUntil = { $gte: now };
  } else if (status === 'expired') {
    query.validUntil = { $lt: new Date() };
  } else if (status === 'inactive') {
    query.isActive = false;
  }

  if (search) {
    query.code = { $regex: search, $options: 'i' };
  }

  const skip = (page - 1) * limit;

  const [coupons, total] = await Promise.all([
    Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Coupon.countDocuments(query),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      coupons,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);

  if (!coupon || coupon.isDeleted) {
    throw new NotFoundError('Coupon not found');
  }

  res.status(200).json({
    status: 'success',
    data: { coupon },
  });
});

const updateCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);

  if (!coupon || coupon.isDeleted) {
    throw new NotFoundError('Coupon not found');
  }

  const {
    code,
    description,
    type,
    value,
    minimumOrder,
    maximumDiscount,
    usageLimit,
    perUserLimit,
    validFrom,
    validUntil,
    applicableCategories,
    applicableProducts,
    excludedProducts,
    isActive,
  } = req.body;

  if (code && code !== coupon.code) {
    const existingCoupon = await Coupon.findOne({ code, _id: { $ne: id } });
    if (existingCoupon) {
      throw new ConflictError('Coupon code already exists');
    }
    coupon.code = code;
  }

  if (description !== undefined) coupon.description = description;
  if (type) coupon.type = type;
  if (value !== undefined) coupon.value = value;
  if (minimumOrder !== undefined) coupon.minimumOrder = minimumOrder;
  if (maximumDiscount !== undefined) coupon.maximumDiscount = maximumDiscount;
  if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
  if (perUserLimit !== undefined) coupon.perUserLimit = perUserLimit;
  if (validFrom) coupon.validFrom = validFrom;
  if (validUntil) coupon.validUntil = validUntil;
  if (applicableCategories) coupon.applicableCategories = applicableCategories;
  if (applicableProducts) coupon.applicableProducts = applicableProducts;
  if (excludedProducts) coupon.excludedProducts = excludedProducts;
  if (isActive !== undefined) coupon.isActive = isActive;

  coupon.updatedBy = req.admin._id;
  await coupon.save();

  res.status(200).json({
    status: 'success',
    message: 'Coupon updated successfully',
    data: { coupon },
  });
});

const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);

  if (!coupon || coupon.isDeleted) {
    throw new NotFoundError('Coupon not found');
  }

  coupon.isDeleted = true;
  coupon.deletedAt = new Date();
  await coupon.save();

  res.status(200).json({
    status: 'success',
    message: 'Coupon deleted successfully',
  });
});

const validateCoupon = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  const validation = await Coupon.validateCoupon(code, req.user._id, req.body.cartTotal || 0);

  res.status(200).json({
    status: 'success',
    data: validation,
  });
});

const getActiveCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.getActiveCoupons();

  res.status(200).json({
    status: 'success',
    data: { coupons },
  });
});

module.exports = {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getActiveCoupons,
};
