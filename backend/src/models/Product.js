const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const variantSchema = new mongoose.Schema({
  weight: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
}, { _id: true });

const dimensionSchema = new mongoose.Schema({
  length: {
    type: Number,
    min: 0,
  },
  width: {
    type: Number,
    min: 0,
  },
  height: {
    type: Number,
    min: 0,
  },
  weight: {
    type: Number,
    min: 0,
  },
  unit: {
    type: String,
    enum: ['cm', 'mm', 'in'],
    default: 'cm',
  },
});

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters'],
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters'],
  },
  category: {
    type: String,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  brand: {
    type: String,
    trim: true,
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100'],
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'],
    default: 'percentage',
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative'],
  },
  variants: [variantSchema],
  dimensions: dimensionSchema,
  ingredients: [{
    type: String,
    trim: true,
  }],
  benefits: [{
    type: String,
    trim: true,
  }],
  howToUse: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  seo: {
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaKeywords: [{
      type: String,
      trim: true,
    }],
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative'],
  },
  soldCount: {
    type: Number,
    default: 0,
    min: [0, 'Sold count cannot be negative'],
  },
  viewCount: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative'],
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
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isDeleted: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ soldCount: -1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discountType === 'percentage') {
    return this.price - (this.price * this.discount / 100);
  } else {
    return this.price - this.discount;
  }
});

// Virtual for total stock (including variants)
productSchema.virtual('totalStock').get(function() {
  if (this.variants && this.variants.length > 0) {
    return this.variants.reduce((total, variant) => total + variant.stock, 0);
  }
  return this.stock;
});

// Virtual for is low stock
productSchema.virtual('isLowStock').get(function() {
  return this.totalStock <= this.lowStockThreshold;
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (typeof next === 'function') {
    next();
  }
});

// Static method to get featured products
productSchema.statics.getFeatured = function() {
  return this.find({ status: 'active', isFeatured: true, isDeleted: false });
};

// Static method to get best sellers
productSchema.statics.getBestSellers = function() {
  return this.find({ status: 'active', isBestSeller: true, isDeleted: false }).sort({ soldCount: -1 });
};

// Static method to get new arrivals
productSchema.statics.getNewArrivals = function() {
  return this.find({ status: 'active', isNewArrival: true, isDeleted: false }).sort({ createdAt: -1 });
};

// Static method to search products
productSchema.statics.search = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } },
      { brand: { $regex: query, $options: 'i' } },
    ],
    status: 'active',
    isDeleted: false,
  });
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
