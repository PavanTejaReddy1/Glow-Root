const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { NotFoundError, ValidationError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price discount status isDeleted');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id });
  }

  cart.items = cart.items.filter(item => {
    const product = item.product;
    return product && product.status === 'active' && !product.isDeleted;
  });

  await cart.save();

  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1, variant } = req.body;

  const product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    throw new NotFoundError('Product not found');
  }

  if (product.status !== 'active') {
    throw new ValidationError('Product is not available');
  }

  const availableStock = variant 
    ? product.variants.find(v => JSON.stringify(v) === JSON.stringify(variant))?.stock || 0
    : product.stock;

  if (availableStock < quantity) {
    throw new ValidationError('Insufficient stock');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id });
  }

  cart.addItem(product, quantity, variant);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item added to cart',
    data: { cart },
  });
});

const updateCartItem = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    throw new ValidationError('Quantity must be at least 1');
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new NotFoundError('Cart not found');
  }

  const item = cart.items.find(item => item._id.toString() === itemId);
  if (!item) {
    throw new NotFoundError('Item not found in cart');
  }

  const product = await Product.findById(item.product);
  if (product) {
    const availableStock = item.variant 
      ? product.variants.find(v => JSON.stringify(v) === JSON.stringify(item.variant))?.stock || 0
      : product.stock;

    if (availableStock < quantity) {
      throw new ValidationError('Insufficient stock');
    }
  }

  cart.updateItemQuantity(itemId, quantity);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Cart item updated',
    data: { cart },
  });
});

const removeFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new NotFoundError('Cart not found');
  }

  cart.removeItem(itemId);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart',
    data: { cart },
  });
});

const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new NotFoundError('Cart not found');
  }

  cart.clearCart();
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Cart cleared',
    data: { cart },
  });
});

const applyCoupon = asyncHandler(async (req, res, next) => {
  const { couponCode } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new NotFoundError('Cart not found');
  }

  const Coupon = require('../models/Coupon');
  const validation = await Coupon.validateCoupon(couponCode, req.user._id, cart.subtotal);

  if (!validation.valid) {
    throw new ValidationError(validation.message);
  }

  const discount = Coupon.calculateDiscount(validation.coupon, cart.subtotal);

  cart.applyCoupon(couponCode, discount);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Coupon applied successfully',
    data: { cart },
  });
});

const removeCoupon = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new NotFoundError('Cart not found');
  }

  cart.removeCoupon();
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Coupon removed',
    data: { cart },
  });
});

const moveToWishlist = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new NotFoundError('Cart not found');
  }

  const item = cart.items.find(item => item._id.toString() === itemId);
  if (!item) {
    throw new NotFoundError('Item not found in cart');
  }

  const Wishlist = require('../models/Wishlist');
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id });
  }

  const product = await Product.findById(item.product);
  if (product) {
    wishlist.addItem(product);
    await wishlist.save();
  }

  cart.removeItem(itemId);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item moved to wishlist',
    data: { cart, wishlist },
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  moveToWishlist,
};
