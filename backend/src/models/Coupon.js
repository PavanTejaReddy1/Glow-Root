const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const couponSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'Coupon code must be at least 3 characters'],
    maxlength: [20, 'Coupon code cannot exceed 20 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['percentage', 'flat'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: [0, 'Value cannot be negative'],
  },
  minimumOrder: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order cannot be negative'],
  },
  maximumDiscount: {
    type: Number,
    min: [0, 'Maximum discount cannot be negative'],
  },
  usageLimit: {
    type: Number,
    default: null,
    min: [1, 'Usage limit must be at least 1'],
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative'],
  },
  perUserLimit: {
    type: Number,
    default: 1,
    min: [1, 'Per user limit must be at least 1'],
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  applicableCategories: [{
    type: String,
    ref: 'Category',
  }],
  applicableProducts: [{
    type: String,
    ref: 'Product',
  }],
  excludedProducts: [{
    type: String,
    ref: 'Product',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: String,
    ref: 'Admin',
  },
  updatedBy: {
    type: String,
    ref: 'Admin',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ isDeleted: 1 });

// Virtual for is expired
couponSchema.virtual('isExpired').get(function() {
  return new Date() > this.validUntil;
});

// Virtual for is not started
couponSchema.virtual('isNotStarted').get(function() {
  return new Date() < this.validFrom;
});

// Virtual for is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && !this.isDeleted && now >= this.validFrom && now <= this.validUntil;
});

// Virtual for usage remaining
couponSchema.virtual('usageRemaining').get(function() {
  if (this.usageLimit === null) return null;
  return this.usageLimit - this.usedCount;
});

// Static method to validate coupon
couponSchema.statics.validateCoupon = async function(code, userId, cartTotal) {
  const coupon = await this.findOne({ code, isActive: true, isDeleted: false });
  
  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code' };
  }

  const now = new Date();
  if (now < coupon.validFrom) {
    return { valid: false, message: 'Coupon is not yet active' };
  }

  if (now > coupon.validUntil) {
    return { valid: false, message: 'Coupon has expired' };
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: 'Coupon usage limit has been reached' };
  }

  if (cartTotal < coupon.minimumOrder) {
    return { valid: false, message: `Minimum order value of ₹${coupon.minimumOrder} required` };
  }

  // Check per user limit
  const Order = mongoose.model('Order');
  const userCouponUsage = await Order.countDocuments({
    user: userId,
    'coupon.code': coupon.code,
    status: { $ne: 'cancelled' },
  });

  if (userCouponUsage >= coupon.perUserLimit) {
    return { valid: false, message: 'You have already used this coupon the maximum number of times' };
  }

  return { valid: true, coupon };
};

// Static method to calculate discount
couponSchema.statics.calculateDiscount = function(coupon, cartTotal) {
  let discount = 0;

  if (coupon.type === 'percentage') {
    discount = (cartTotal * coupon.value) / 100;
    if (coupon.maximumDiscount) {
      discount = Math.min(discount, coupon.maximumDiscount);
    }
  } else {
    discount = coupon.value;
  }

  return Math.min(discount, cartTotal);
};

// Method to increment usage
couponSchema.methods.incrementUsage = function() {
  this.usedCount += 1;
};

// Static method to get active coupons
couponSchema.statics.getActiveCoupons = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    isDeleted: false,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
  }).sort({ createdAt: -1 });
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
