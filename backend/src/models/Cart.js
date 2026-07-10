const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const cartItemSchema = new mongoose.Schema({
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
    default: 1,
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
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const cartSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  user: {
    type: String,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  coupon: {
    code: {
      type: String,
    },
    discount: {
      type: Number,
      min: [0, 'Coupon discount cannot be negative'],
    },
  },
  subtotal: {
    type: Number,
    default: 0,
    min: [0, 'Subtotal cannot be negative'],
  },
  shippingCharge: {
    type: Number,
    default: 0,
    min: [0, 'Shipping charge cannot be negative'],
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
  },
  total: {
    type: Number,
    default: 0,
    min: [0, 'Total cannot be negative'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
cartSchema.index({ user: 1 });

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.discount = this.coupon?.discount || 0;
  this.total = this.subtotal + this.shippingCharge + this.tax - this.discount;
  next();
});

// Method to add item
cartSchema.methods.addItem = function(product, quantity = 1, variant = null) {
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === product._id.toString() && 
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].total = this.items[existingItemIndex].price * this.items[existingItemIndex].quantity;
  } else {
    this.items.push({
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
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.find(item => item._id.toString() === itemId.toString());
  if (item) {
    item.quantity = quantity;
    item.total = item.price * quantity;
  }
};

// Method to remove item
cartSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.coupon = null;
  this.discount = 0;
};

// Method to apply coupon
cartSchema.methods.applyCoupon = function(couponCode, discountAmount) {
  this.coupon = {
    code: couponCode,
    discount: discountAmount,
  };
};

// Method to remove coupon
cartSchema.methods.removeCoupon = function() {
  this.coupon = null;
  this.discount = 0;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
