const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const [
    totalRevenue,
    todayRevenue,
    weeklyRevenue,
    monthlyRevenue,
    totalOrders,
    todayOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalProducts,
    activeProducts,
    lowStockProducts,
    totalUsers,
    newUsers,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' }, 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: weekAgo }, status: { $ne: 'cancelled' }, 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: monthAgo }, status: { $ne: 'cancelled' }, 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ status: { $ne: 'cancelled' } }),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'delivered' }),
    Order.countDocuments({ status: 'cancelled' }),
    Product.countDocuments({ isDeleted: false }),
    Product.countDocuments({ status: 'active', isDeleted: false }),
    Product.countDocuments({ status: 'active', isDeleted: false, stock: { $lt: 10 } }),
    User.countDocuments({ isDeleted: false }),
    User.countDocuments({ createdAt: { $gte: today }, isDeleted: false }),
  ]);

  const topProducts = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' }, revenue: { $sum: '$items.total' } } },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $project: { _id: 1, name: '$product.name', images: '$product.images', totalSold: 1, revenue: 1 } },
  ]);

  const topCategories = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $group: { _id: '$product.category', totalSold: { $sum: 1 }, revenue: { $sum: '$total' } } },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    { $project: { _id: 1, name: '$category.name', totalSold: 1, revenue: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      revenue: {
        total: totalRevenue[0]?.total || 0,
        today: todayRevenue[0]?.total || 0,
        weekly: weeklyRevenue[0]?.total || 0,
        monthly: monthlyRevenue[0]?.total || 0,
      },
      orders: {
        total: totalOrders,
        today: todayOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock: lowStockProducts,
      },
      users: {
        total: totalUsers,
        new: newUsers,
      },
      topProducts,
      topCategories,
    },
  });
});

const getRevenueChart = asyncHandler(async (req, res, next) => {
  const { period = 'monthly' } = req.query;
  const now = new Date();
  let startDate, groupBy, format;

  if (period === 'daily') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
    groupBy = {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
      day: { $dayOfMonth: '$createdAt' },
    };
    format = '%Y-%m-%d';
  } else if (period === 'weekly') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 12 * 7);
    groupBy = {
      year: { $year: '$createdAt' },
      week: { $week: '$createdAt' },
    };
    format = '%Y-W%V';
  } else {
    startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 12);
    groupBy = {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
    };
    format = '%Y-%m';
  }

  const revenueData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $ne: 'cancelled' },
        'payment.status': 'paid',
      },
    },
    {
      $group: {
        _id: groupBy,
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id': 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: { revenueData, period },
  });
});

const getSalesChart = asyncHandler(async (req, res, next) => {
  const { period = 'monthly' } = req.query;
  const now = new Date();
  let startDate, groupBy;

  if (period === 'daily') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
    groupBy = {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
      day: { $dayOfMonth: '$createdAt' },
    };
  } else if (period === 'weekly') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 12 * 7);
    groupBy = {
      year: { $year: '$createdAt' },
      week: { $week: '$createdAt' },
    };
  } else {
    startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 12);
    groupBy = {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
    };
  }

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: groupBy,
        orders: { $sum: 1 },
        items: { $sum: { $size: '$items' } },
      },
    },
    { $sort: { '_id': 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: { salesData, period },
  });
});

const getCustomerGrowth = asyncHandler(async (req, res, next) => {
  const { period = 'monthly' } = req.query;
  const now = new Date();
  let startDate, groupBy;

  if (period === 'daily') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
    groupBy = {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
      day: { $dayOfMonth: '$createdAt' },
    };
  } else if (period === 'weekly') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 12 * 7);
    groupBy = {
      year: { $year: '$createdAt' },
      week: { $week: '$createdAt' },
    };
  } else {
    startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 12);
    groupBy = {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
    };
  }

  const customerData = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: groupBy,
        customers: { $sum: 1 },
      },
    },
    { $sort: { '_id': 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: { customerData, period },
  });
});

const getOrderStatusDistribution = asyncHandler(async (req, res, next) => {
  const statusData = await Order.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: { statusData },
  });
});

const getCategoryPerformance = asyncHandler(async (req, res, next) => {
  const categoryData = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.category',
        orders: { $sum: 1 },
        revenue: { $sum: '$items.total' },
        items: { $sum: '$items.quantity' },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        _id: 1,
        name: '$category.name',
        orders: 1,
        revenue: 1,
        items: 1,
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: { categoryData },
  });
});

module.exports = {
  getDashboardStats,
  getRevenueChart,
  getSalesChart,
  getCustomerGrowth,
  getOrderStatusDistribution,
  getCategoryPerformance,
};
