const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminEmail    = process.env.ADMIN_EMAIL    || (() => { throw new Error('ADMIN_EMAIL env var is required'); })();
    const adminPassword = process.env.ADMIN_PASSWORD || (() => { throw new Error('ADMIN_PASSWORD env var is required'); })();
    const adminName     = process.env.ADMIN_NAME     || 'Super Admin';

    const existing = await Admin.findOne({ email: adminEmail });
    if (existing) {
      console.log(`Admin already exists: ${adminEmail}`);
      process.exit(0);
    }

    const admin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'superadmin',
      permissions: ['products', 'categories', 'orders', 'customers', 'reviews', 'coupons', 'analytics', 'settings', 'inventory', 'homepage'],
      isActive: true,
    });

    console.log('Admin created successfully.');
    console.log(`Email: ${admin.email}`);
    console.log('Role: superadmin');
    console.log('\nChange the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
