const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { razorpay, createRazorpayOrder, verifyRazorpayPayment, refundPayment } = require('../config');
const { NotFoundError, ValidationError, ConflictError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress, paymentMethod, couponCode } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  
  if (!cart || cart.items.length === 0) {
    throw new ValidationError('Cart is empty');
  }

  let discount = 0;
  let coupon = null;

  if (couponCode) {
    const validation = await Coupon.validateCoupon(couponCode, req.user._id, cart.subtotal);
    if (!validation.valid) {
      throw new ValidationError(validation.message);
    }
    discount = Coupon.calculateDiscount(validation.coupon, cart.subtotal);
    coupon = {
      code: validation.coupon.code,
      discount,
    };
    validation.coupon.incrementUsage();
    await validation.coupon.save();
  }

  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map(item => ({
      product: item.product._id,
      productName: item.productName,
      productImage: item.productImage,
      variant: item.variant,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount,
      total: item.total,
    })),
    shippingAddress,
    payment: {
      method: paymentMethod,
      status: paymentMethod === 'cod' ? 'pending' : 'pending',
    },
    subtotal: cart.subtotal,
    shippingCharge: cart.shippingCharge,
    tax: cart.tax,
    discount,
    coupon,
    total: cart.subtotal + cart.shippingCharge + cart.tax - discount,
  });

  if (paymentMethod === 'razorpay') {
    const razorpayOrder = await createRazorpayOrder(
      order.total,
      'INR',
      order.orderNumber
    );

    order.payment.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        order,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
      },
    });
  } else {
    order.payment.status = 'pending';
    await order.save();

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], coupon: null, discount: 0 } }
    );

    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully',
      data: { order },
    });
  }
});

const verifyPayment = asyncHandler(async (req, res, next) => {
  const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.payment.status === 'paid') {
    throw new ConflictError('Payment already verified');
  }

  const isValid = verifyRazorpayPayment(
    order.payment.razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );

  if (!isValid) {
    throw new ValidationError('Invalid payment signature');
  }

  order.payment.razorpayPaymentId = razorpayPaymentId;
  order.payment.razorpaySignature = razorpaySignature;
  order.payment.status = 'paid';
  order.payment.paidAt = new Date();
  order.status = 'confirmed';

  await order.save();

  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [], coupon: null, discount: 0 } }
  );

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, soldCount: item.quantity },
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Payment verified successfully',
    data: { order },
  });
});

const getOrders = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name images')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    Order.countDocuments(query),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.getUserOrders(req.user._id)
    .populate('items.product', 'name images');

  res.status(200).json({
    status: 'success',
    data: { orders },
  });
});

const getOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('user', 'firstName lastName email phone')
    .populate('items.product', 'name images');

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  order.updateStatus(status, note);
  order.updatedBy = req.admin._id;

  if (status === 'cancelled' && order.payment.status === 'paid') {
    try {
      const refund = await refundPayment(order.payment.razorpayPaymentId, order.total);
      order.payment.refundId = refund.id;
      order.payment.refundAmount = refund.amount / 100;
      order.payment.refundStatus = 'completed';
      order.payment.refundedAt = new Date();

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, soldCount: -item.quantity },
        });
      }
    } catch (error) {
      console.error('Refund failed:', error);
      order.payment.refundStatus = 'failed';
    }
  }

  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order status updated successfully',
    data: { order },
  });
});

const cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ValidationError('You can only cancel your own orders');
  }

  if (!['pending', 'confirmed'].includes(order.status)) {
    throw new ValidationError('Order cannot be cancelled at this stage');
  }

  order.updateStatus('cancelled', reason);
  order.cancellationReason = reason;

  if (order.payment.status === 'paid') {
    try {
      const refund = await refundPayment(order.payment.razorpayPaymentId, order.total);
      order.payment.refundId = refund.id;
      order.payment.refundAmount = refund.amount / 100;
      order.payment.refundStatus = 'completed';
      order.payment.refundedAt = new Date();

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, soldCount: -item.quantity },
        });
      }
    } catch (error) {
      console.error('Refund failed:', error);
      order.payment.refundStatus = 'failed';
    }
  }

  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order cancelled successfully',
    data: { order },
  });
});

const updateTracking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { carrier, trackingNumber, trackingUrl, estimatedDelivery } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  order.tracking = {
    carrier,
    trackingNumber,
    trackingUrl,
    estimatedDelivery,
  };

  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Tracking information updated successfully',
    data: { order },
  });
});

const getDashboardStats = asyncHandler(async (req, res, next) => {
  const stats = await Order.getDashboardStats();

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

module.exports = {
  createOrder,
  verifyPayment,
  getOrders,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  updateTracking,
  getDashboardStats,
};
