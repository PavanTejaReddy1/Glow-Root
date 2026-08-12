const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { NotFoundError, ValidationError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const getWishlist = asyncHandler(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product', 'name images price discount status isDeleted slug');

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id });
  }

  // Filter out inactive/deleted products without saving
  const validItems = wishlist.items.filter(item => {
    const product = item.product;
    return product && product.status === 'active' && !product.isDeleted;
  });

  // Update productSlug for existing items if missing
  validItems.forEach(item => {
    if (item.product && !item.productSlug && item.product.slug) {
      item.productSlug = item.product.slug;
    }
  });

  // Only save if items were removed or slugs were added
  if (validItems.length !== wishlist.items.length) {
    wishlist.items = validItems;
    await wishlist.save();
  } else if (validItems.some(item => !item.productSlug && item.product?.slug)) {
    // Save if we added slugs
    wishlist.items = validItems;
    await wishlist.save();
  }

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
  console.log('Remove from wishlist - productId:', productId, 'type:', typeof productId);

  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    throw new NotFoundError('Wishlist not found');
  }

  console.log('Wishlist items before remove:', wishlist.items.length);
  console.log('Wishlist items product IDs:', wishlist.items.map(i => i.product));

  try {
    wishlist.removeItem(productId);
    console.log('After removeItem call, items:', wishlist.items.length);
    await wishlist.save();
    console.log('After save, items:', wishlist.items.length);
  } catch (saveError) {
    console.error('Error saving wishlist after remove:', saveError);
    throw saveError;
  }

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
