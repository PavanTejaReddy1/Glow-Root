const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const categorySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [100, 'Category name cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    url: {
      type: String,
    },
    publicId: {
      type: String,
    },
    alt: {
      type: String,
      trim: true,
    },
  },
  parent: {
    type: String,
    ref: 'Category',
    default: null,
  },
  order: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
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
categorySchema.index({ parent: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ order: 1 });
categorySchema.index({ isDeleted: 1 });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
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

// Static method to get top-level categories
categorySchema.statics.getTopLevel = function() {
  return this.find({ parent: null, isActive: true, isDeleted: false }).sort({ order: 1 });
};

// Static method to get featured categories
categorySchema.statics.getFeatured = function() {
  return this.find({ isFeatured: true, isActive: true, isDeleted: false }).sort({ order: 1 });
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
