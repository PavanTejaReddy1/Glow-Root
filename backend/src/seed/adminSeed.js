const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@glowroot.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists:', adminEmail);
      console.log('Admin ID:', existingAdmin._id);
      process.exit(0);
    }

    const admin = await Admin.create({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'superadmin',
      permissions: [
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
      isActive: true,
    });

    console.log('Admin created successfully:');
    console.log('Email:', admin.email);
    console.log('Password:', adminPassword);
    console.log('Admin ID:', admin._id);
    console.log('\nPlease change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
