const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { NotFoundError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const getWishlist = asyncHandler(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product', 'name images price discount status isDeleted');

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id });
  }

  wishlist.items = wishlist.items.filter(item => {
    const product = item.product;
    return product && product.status === 'active' && !product.isDeleted;
  });

  await wishlist.save();

  res.status(200).json({
    status: 'success',
    data: { wishlist },
  });
});

const addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    throw new NotFoundError('Product not found');
  }

  if (product.status !== 'active') {
    throw new ValidationError('Product is not available');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id });
  }

  wishlist.addItem(product);
  await wishlist.save();

  res.status(200).json({
    status: 'success',
    message: 'Item added to wishlist',
    data: { wishlist },
  });
});

const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  wishlist.removeItem(productId);
  await wishlist.save();

  res.status(200).json({
    status: 'success',
    message: 'Item removed from wishlist',
    data: { wishlist },
  });
});

const moveToCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  const Cart = require('../models/Cart');
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id });
  }

  const product = await Product.findById(productId);
  if (product) {
    wishlist.moveToCart(productId, cart);
    await cart.save();
  }

  await wishlist.save();

  res.status(200).json({
    status: 'success',
    message: 'Item moved to cart',
    data: { wishlist, cart },
  });
});

const clearWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  wishlist.items = [];
  await wishlist.save();

  res.status(200).json({
    status: 'success',
    message: 'Wishlist cleared',
    data: { wishlist },
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
  clearWishlist,
};
