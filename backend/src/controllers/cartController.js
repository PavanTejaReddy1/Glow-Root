const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const { NotFoundError, ValidationError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

/* Read shipping config from Settings — cached per request */
const getShippingConfig = async () => {
  const settings = await Settings.getSettings();
  return {
    freeShippingAbove: settings.freeShippingAbove ?? 1999,
    shippingCharge:    settings.shippingCharge    ?? 99,
  };
};

/* Calculate shipping based on subtotal and settings */
const calcShipping = (subtotal, config) => {
  return subtotal >= config.freeShippingAbove ? 0 : config.shippingCharge;
};

const getCart = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }
    
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price discount status isDeleted');

    if (!cart) {
      // Use collection.insertOne to bypass all middleware
      const { v4: uuidv4 } = require('uuid');
      const cartId = uuidv4();
      
      try {
        await Cart.collection.insertOne({
          _id: cartId,
          user: req.user._id,
          items: [],
          subtotal: 0,
          discount: 0,
          shippingCharge: 0,
          tax: 0,
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } catch (insertError) {
        throw insertError;
      }
      
      cart = await Cart.findOne({ _id: cartId }).populate('items.product', 'name images price discount status isDeleted');
    }

    cart.items = cart.items.filter(item => {
      const product = item.product;
      return product && product.status === 'active' && !product.isDeleted;
    });

    // Calculate totals using real shipping config from Settings
    const shippingConfig = await getShippingConfig();
    cart.subtotal     = cart.items.reduce((sum, item) => sum + item.total, 0);
    cart.discount     = cart.coupon?.discount || 0;
    cart.shippingCharge = calcShipping(cart.subtotal, shippingConfig);
    cart.total        = cart.subtotal + cart.shippingCharge + (cart.tax || 0) - cart.discount;

    await Cart.updateOne(
      { _id: cart._id },
      {
        items:          cart.items,
        subtotal:       cart.subtotal,
        discount:       cart.discount,
        shippingCharge: cart.shippingCharge,
        total:          cart.total,
        coupon:         cart.coupon,
        updatedAt:      new Date(),
      }
    );

    res.status(200).json({
      status: 'success',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
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
      const { v4: uuidv4 } = require('uuid');
      const cartId = uuidv4();
      await Cart.collection.insertOne({
        _id: cartId,
        user: req.user._id,
        items: [],
        subtotal: 0,
        discount: 0,
        shippingCharge: 0,
        tax: 0,
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      cart = await Cart.findOne({ _id: cartId });
    }

    // Add item manually
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === product._id.toString() && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].total = cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
    } else {
      cart.items.push({
        product: product._id,
        productName: product.name,
        productImage: product.images[0]?.url,
        variant,
        quantity,
        price: product.discountedPrice || product.price,
        discount: product.discount,
        total: (product.discountedPrice || product.price) * quantity,
      });
    }

    // Calculate totals using real shipping config from Settings
    const shippingConfig = await getShippingConfig();
    cart.subtotal       = cart.items.reduce((sum, item) => sum + item.total, 0);
    cart.discount       = cart.coupon?.discount || 0;
    cart.shippingCharge = calcShipping(cart.subtotal, shippingConfig);
    cart.total          = cart.subtotal + cart.shippingCharge + (cart.tax || 0) - cart.discount;

    await Cart.updateOne(
      { _id: cart._id },
      {
        items:          cart.items,
        subtotal:       cart.subtotal,
        discount:       cart.discount,
        shippingCharge: cart.shippingCharge,
        total:          cart.total,
        coupon:         cart.coupon,
        updatedAt:      new Date(),
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Item added to cart',
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) throw new ValidationError('Quantity must be at least 1');

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new NotFoundError('Cart not found');

    const item = cart.items.find(i => i._id.toString() === itemId);
    if (!item) throw new NotFoundError('Item not found in cart');

    // Check stock
    const product = await Product.findById(item.product);
    if (product) {
      const available = product.stock;
      if (available < quantity) throw new ValidationError(`Only ${available} units available`);
    }

    // Update item inline — use updateOne to avoid save() middleware issues
    const shippingConfig = await getShippingConfig();
    const updatedItems = cart.items.map(i => {
      if (i._id.toString() === itemId) {
        return { ...i.toObject(), quantity, total: i.price * quantity };
      }
      return i.toObject();
    });

    const subtotal = updatedItems.reduce((sum, i) => sum + i.total, 0);
    const discount = cart.coupon?.discount || 0;
    const shippingCharge = calcShipping(subtotal, shippingConfig);
    const total = Math.max(0, subtotal + shippingCharge + (cart.tax || 0) - discount);

    await Cart.updateOne(
      { _id: cart._id },
      { items: updatedItems, subtotal, discount, shippingCharge, total, updatedAt: new Date() }
    );

    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name images price discount status slug category');

    res.status(200).json({
      status: 'success',
      message: 'Cart item updated',
      data: { cart: updatedCart },
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new NotFoundError('Cart not found');

    const updatedItems = cart.items
      .filter(i => i._id.toString() !== itemId)
      .map(i => i.toObject());

    const shippingConfig = await getShippingConfig();
    const subtotal = updatedItems.reduce((sum, i) => sum + i.total, 0);
    const discount = cart.coupon?.discount || 0;
    const shippingCharge = calcShipping(subtotal, shippingConfig);
    const total = Math.max(0, subtotal + shippingCharge + (cart.tax || 0) - discount);

    await Cart.updateOne(
      { _id: cart._id },
      { items: updatedItems, subtotal, discount, shippingCharge, total, updatedAt: new Date() }
    );

    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name images price discount status slug category');

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart',
      data: { cart: updatedCart },
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new NotFoundError('Cart not found');

    await Cart.updateOne(
      { _id: cart._id },
      { items: [], subtotal: 0, discount: 0, shippingCharge: 0, total: 0, coupon: null, updatedAt: new Date() }
    );

    const updatedCart = await Cart.findOne({ user: req.user._id });

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared',
      data: { cart: updatedCart },
    });
  } catch (error) {
    next(error);
  }
};

const applyCoupon = async (req, res, next) => {
  try {
    const { couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new NotFoundError('Cart not found');

    // Recalculate subtotal from items
    const subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);

    const Coupon = require('../models/Coupon');
    const validation = await Coupon.validateCoupon(couponCode, req.user._id, subtotal);
    if (!validation.valid) throw new ValidationError(validation.message);

    const discountAmount = Coupon.calculateDiscount(validation.coupon, subtotal);
    const shippingConfig = await getShippingConfig();
    const shippingCharge = calcShipping(subtotal, shippingConfig);
    const newTotal = Math.max(0, subtotal + shippingCharge + (cart.tax || 0) - discountAmount);

    await Cart.updateOne(
      { _id: cart._id },
      {
        coupon:         { code: couponCode.toUpperCase(), discount: discountAmount },
        subtotal,
        discount:       discountAmount,
        shippingCharge,
        total:          newTotal,
        updatedAt:      new Date(),
      }
    );

    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name images price discount status');

    res.status(200).json({
      status: 'success',
      message: 'Coupon applied successfully',
      data: { cart: updatedCart },
    });
  } catch (error) {
    next(error);
  }
};

const removeCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new NotFoundError('Cart not found');

    const subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    const shippingConfig = await getShippingConfig();
    const shippingCharge = calcShipping(subtotal, shippingConfig);
    const newTotal = Math.max(0, subtotal + shippingCharge + (cart.tax || 0));

    await Cart.updateOne(
      { _id: cart._id },
      {
        $unset:         { coupon: '' },
        subtotal,
        discount:       0,
        shippingCharge,
        total:          newTotal,
        updatedAt:      new Date(),
      }
    );

    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name images price discount status');

    res.status(200).json({
      status: 'success',
      message: 'Coupon removed',
      data: { cart: updatedCart },
    });
  } catch (error) {
    next(error);
  }
};

const moveToWishlist = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

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
