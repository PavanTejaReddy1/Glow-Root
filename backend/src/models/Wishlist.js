const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const wishlistItemSchema = new mongoose.Schema({
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
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const wishlistSchema = new mongoose.Schema({
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
  items: [wishlistItemSchema],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'items.product': 1 });

// Method to add item
wishlistSchema.methods.addItem = function(product) {
  const exists = this.items.some(
    item => item.product.toString() === product._id.toString()
  );

  if (!exists) {
    this.items.push({
      product: product._id,
      productName: product.name,
      productImage: product.images[0]?.url,
      price: product.price,
      discount: product.discount,
    });
  }
};

// Method to remove item
wishlistSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
};

// Method to move item to cart
wishlistSchema.methods.moveToCart = function(productId, cart) {
  const itemIndex = this.items.findIndex(
    item => item.product.toString() === productId.toString()
  );

  if (itemIndex > -1) {
    const item = this.items[itemIndex];
    cart.addItem(
      { _id: item.product, name: item.productName, images: [{ url: item.productImage }], price: item.price, discount: item.discount },
      1
    );
    this.items.splice(itemIndex, 1);
  }
};

// Method to check if product exists
wishlistSchema.methods.hasProduct = function(productId) {
  return this.items.some(
    item => item.product.toString() === productId.toString()
  );
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
