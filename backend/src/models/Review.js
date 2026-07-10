const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reviewSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  product: {
    type: String,
    ref: 'Product',
    required: true,
  },
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
  order: {
    type: String,
    ref: 'Order',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
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
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  helpful: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative'],
  },
  notHelpful: {
    type: Number,
    default: 0,
    min: [0, 'Not helpful count cannot be negative'],
  },
  approvedBy: {
    type: String,
    ref: 'Admin',
  },
  approvedAt: {
    type: Date,
  },
  rejectedBy: {
    type: String,
    ref: 'Admin',
  },
  rejectedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ order: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Compound index to ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Pre-save middleware to update product rating
reviewSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'approved') {
    const Product = mongoose.model('Product');
    const product = await Product.findById(this.product);
    if (product) {
      const reviews = await mongoose.model('Review').find({ product: this.product, status: 'approved' });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      product.rating = Math.round(avgRating * 10) / 10;
      product.reviewCount = reviews.length;
      await product.save();
    }
  }
  next();
});

// Static method to get product reviews
reviewSchema.statics.getProductReviews = function(productId) {
  return this.find({ product: productId, status: 'approved' }).sort({ helpful: -1, createdAt: -1 });
};

// Static method to get user reviews
reviewSchema.statics.getUserReviews = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to get pending reviews
reviewSchema.statics.getPendingReviews = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: -1 });
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
