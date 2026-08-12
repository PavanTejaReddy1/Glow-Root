const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get all customers (admin only)
// @route   GET /api/v1/admin/customers
// @access  Private/Admin
exports.getAllCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

  // Fix: User model has no 'role' field — query all non-deleted users
  const customers = await User.find({ isDeleted: false })
    .select('-password -refreshToken -emailVerificationToken -passwordResetToken -__v')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments({ isDeleted: false });

    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ user: customer._id });
        const orderCount = orders.length;
        // Order model uses 'total' field, not 'totalAmount'
        const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        return {
          ...customer.toObject(),
          orderCount,
          totalSpent,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        customers: customersWithStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch customers'
    });
  }
};

// @desc    Get single customer by ID (admin only)
// @route   GET /api/v1/admin/customers/:id
// @access  Private/Admin
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
      .select('-password -refreshToken -emailVerificationToken -passwordResetToken -__v');

    if (!customer || customer.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const orders = await Order.find({ user: customer._id }).sort({ createdAt: -1 });
    const orderCount = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        customer: {
          ...customer.toObject(),
          orderCount,
          totalSpent,
          orders
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch customer'
    });
  }
};

// @desc    Update customer (admin only)
// @route   PUT /api/v1/admin/customers/:id
// @access  Private/Admin
exports.updateCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, addresses } = req.body;

    const customer = await User.findById(req.params.id);

    if (!customer || customer.isDeleted) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (firstName) customer.firstName = firstName;
    if (lastName) customer.lastName = lastName;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    if (addresses) customer.addresses = addresses;

    await customer.save();

    res.status(200).json({
      success: true,
      data: { customer },
      message: 'Customer updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update customer'
    });
  }
};

// @desc    Delete customer (admin only)
// @route   DELETE /api/v1/admin/customers/:id
// @access  Private/Admin
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer || customer.isDeleted) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Soft delete
    customer.isDeleted = true;
    customer.deletedAt = new Date();
    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete customer'
    });
  }
};
