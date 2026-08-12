const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const adminSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  name: {
    type: String,
    required: [true, 'Admin name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  avatar: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin',
  },
  permissions: [{
    type: String,
    enum: [
      'products',
      'categories',
      'orders',
      'customers',
      'reviews',
      'coupons',
      'analytics',
      'settings',
      'inventory',
      'homepage',
    ],
  }],
  lastLogin: {
    type: Date,
    default: null,
  },
  passwordResetOtp: {
    type: String,
    select: false,
  },
  passwordResetOtpExpires: {
    type: Date,
    select: false,
  },
  passwordResetOtpVerified: {
    type: Boolean,
    default: false,
    select: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
adminSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') {
      return next();
    }
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    if (typeof next === 'function') {
      next();
    }
  } catch (error) {
    if (typeof next === 'function') {
      next(error);
    } else {
      throw error;
    }
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to check if email exists
adminSchema.statics.isEmailTaken = async function(email, excludeAdminId) {
  const admin = await this.findOne({ email, _id: { $ne: excludeAdminId } });
  return !!admin;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
