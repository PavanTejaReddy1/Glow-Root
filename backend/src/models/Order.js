const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: String,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
  },
  variant: {
    type: mongoose.Schema.Types.Mixed,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative'],
  },
}, { _id: true });

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true,
  },
  addressLine2: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'India',
  },
});

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['cod', 'razorpay'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  paidAt: {
    type: Date,
  },
  refundId: {
    type: String,
  },
  refundAmount: {
    type: Number,
    min: [0, 'Refund amount cannot be negative'],
  },
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'processing', 'completed', 'failed'],
    default: 'none',
  },
  refundedAt: {
    type: Date,
  },
});

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  payment: paymentSchema,
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative'],
  },
  shippingCharge: {
    type: Number,
    required: true,
    min: [0, 'Shipping charge cannot be negative'],
    default: 0,
  },
  tax: {
    type: Number,
    required: true,
    min: [0, 'Tax cannot be negative'],
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
  },
  coupon: {
    code: {
      type: String,
    },
    discount: {
      type: Number,
      min: [0, 'Coupon discount cannot be negative'],
    },
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
  },
  statusHistory: [{
    status: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
  }],
  tracking: {
    carrier: {
      type: String,
      trim: true,
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    trackingUrl: {
      type: String,
      trim: true,
    },
    estimatedDelivery: {
      type: Date,
    },
  },
  notes: {
    type: String,
    trim: true,
  },
  cancelledAt: {
    type: Date,
  },
  cancellationReason: {
    type: String,
    trim: true,
  },
  returnedAt: {
    type: Date,
  },
  returnReason: {
    type: String,
    trim: true,
  },
  deliveredAt: {
    type: Date,
  },
  createdBy: {
    type: String,
    ref: 'Admin',
  },
  updatedBy: {
    type: String,
    ref: 'Admin',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'payment.razorpayPaymentId': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    const orderNum = String(count + 1).padStart(6, '0');
    this.orderNumber = `GR${orderNum}`;
  }
  next();
});

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

// Method to update status
orderSchema.methods.updateStatus = function(status, note = '') {
  this.status = status;
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    note,
  });

  if (status === 'cancelled') {
    this.cancelledAt = new Date();
  } else if (status === 'returned') {
    this.returnedAt = new Date();
  } else if (status === 'delivered') {
    this.deliveredAt = new Date();
  }
};

// Static method to get user orders
orderSchema.statics.getUserOrders = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get dashboard stats
orderSchema.statics.getDashboardStats = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await this.aggregate([
    {
      $facet: {
        totalOrders: [
          { $match: { status: { $ne: 'cancelled' } } },
          { $count: 'count' }
        ],
        todayOrders: [
          { $match: { createdAt: { $gte: today } } },
          { $count: 'count' }
        ],
        todayRevenue: [
          { 
            $match: { 
              createdAt: { $gte: today },
              status: { $ne: 'cancelled' },
              'payment.status': 'paid'
            } 
          },
          { $group: { _id: null, total: { $sum: '$total' } } }
        ],
        pendingOrders: [
          { $match: { status: 'pending' } },
          { $count: 'count' }
        ],
        deliveredOrders: [
          { $match: { status: 'delivered' } },
          { $count: 'count' }
        ],
        cancelledOrders: [
          { $match: { status: 'cancelled' } },
          { $count: 'count' }
        ],
      }
    }
  ]);

  return {
    totalOrders: stats[0].totalOrders[0]?.count || 0,
    todayOrders: stats[0].todayOrders[0]?.count || 0,
    todayRevenue: stats[0].todayRevenue[0]?.total || 0,
    pendingOrders: stats[0].pendingOrders[0]?.count || 0,
    deliveredOrders: stats[0].deliveredOrders[0]?.count || 0,
    cancelledOrders: stats[0].cancelledOrders[0]?.count || 0,
  };
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
