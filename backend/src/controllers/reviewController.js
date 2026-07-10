const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { NotFoundError, ValidationError, ConflictError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const createReview = asyncHandler(async (req, res, next) => {
  const { productId, orderId, rating, title, comment, images } = req.body;

  const product = await Product.findById(productId);
  if (!product || product.isDeleted) {
    throw new NotFoundError('Product not found');
  }

  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.status !== 'delivered') {
    throw new ValidationError('You can only review products from delivered orders');
  }

  const orderItem = order.items.find(item => item.product.toString() === productId);
  if (!orderItem) {
    throw new ValidationError('Product not found in this order');
  }

  const existingReview = await Review.findOne({ user: req.user._id, product: productId });
  if (existingReview) {
    throw new ConflictError('You have already reviewed this product');
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    order: orderId,
    rating,
    title,
    comment,
    images: images || [],
  });

  res.status(201).json({
    status: 'success',
    message: 'Review submitted successfully',
    data: { review },
  });
});

const getProductReviews = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const product = await Product.findById(productId);
  if (!product || product.isDeleted) {
    throw new NotFoundError('Product not found');
  }

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.getProductReviews(productId)
      .populate('user', 'firstName lastName avatar')
      .skip(skip)
      .limit(parseInt(limit)),
    Review.countDocuments({ product: productId, status: 'approved' }),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getUserReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.getUserReviews(req.user._id)
    .populate('product', 'name images')
    .populate('order', 'orderNumber status');

  res.status(200).json({
    status: 'success',
    data: { reviews },
  });
});

const getPendingReviews = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.getPendingReviews()
      .populate('user', 'firstName lastName email')
      .populate('product', 'name images')
      .skip(skip)
      .limit(parseInt(limit)),
    Review.countDocuments({ status: 'pending' }),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const approveReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  if (review.status !== 'pending') {
    throw new ValidationError('Review has already been processed');
  }

  review.status = 'approved';
  review.approvedBy = req.admin._id;
  review.approvedAt = new Date();
  await review.save();

  res.status(200).json({
    status: 'success',
    message: 'Review approved successfully',
    data: { review },
  });
});

const rejectReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  const review = await Review.findById(id);

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  if (review.status !== 'pending') {
    throw new ValidationError('Review has already been processed');
  }

  review.status = 'rejected';
  review.rejectedBy = req.admin._id;
  review.rejectedAt = new Date();
  review.rejectionReason = reason;
  await review.save();

  res.status(200).json({
    status: 'success',
    message: 'Review rejected successfully',
    data: { review },
  });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  await Review.findByIdAndDelete(id);

  const product = await Product.findById(review.product);
  if (product) {
    const reviews = await Review.find({ product: review.product, status: 'approved' });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    product.rating = Math.round(avgRating * 10) / 10;
    product.reviewCount = reviews.length;
    await product.save();
  }

  res.status(200).json({
    status: 'success',
    message: 'Review deleted successfully',
  });
});

const markHelpful = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  review.helpful += 1;
  await review.save();

  res.status(200).json({
    status: 'success',
    message: 'Review marked as helpful',
    data: { review },
  });
});

module.exports = {
  createReview,
  getProductReviews,
  getUserReviews,
  getPendingReviews,
  approveReview,
  rejectReview,
  deleteReview,
  markHelpful,
};
