const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Get or create categories
    let skincareCategory = await Category.findOne({ name: 'Skincare' });
    if (!skincareCategory) {
      skincareCategory = await Category.create({
        name: 'Skincare',
        description: 'Premium skincare products for all skin types',
        image: {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/skincare.jpg',
          publicId: 'skincare',
          alt: 'Skincare products'
        },
        isFeatured: true,
        isActive: true,
      });
    }

    let haircareCategory = await Category.findOne({ name: 'Haircare' });
    if (!haircareCategory) {
      haircareCategory = await Category.create({
        name: 'Haircare',
        description: 'Natural hair care solutions',
        image: {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/haircare.jpg',
          publicId: 'haircare',
          alt: 'Haircare products'
        },
        isFeatured: true,
        isActive: true,
      });
    }

    let bodycareCategory = await Category.findOne({ name: 'Bodycare' });
    if (!bodycareCategory) {
      bodycareCategory = await Category.create({
        name: 'Bodycare',
        description: 'Luxurious body care products',
        image: {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/bodycare.jpg',
          publicId: 'bodycare',
          alt: 'Bodycare products'
        },
        isFeatured: true,
        isActive: true,
      });
    }

    // Sample products
    const products = [
      {
        name: 'Radiance Face Serum',
        slug: 'radiance-face-serum',
        description: 'A powerful vitamin C serum that brightens and evens skin tone while reducing the appearance of dark spots and fine lines.',
        shortDescription: 'Brightening vitamin C serum for radiant skin',
        category: skincareCategory._id,
        brand: 'GlowRoot',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
            publicId: 'serum-1',
            alt: 'Radiance Face Serum',
            isPrimary: true
          }
        ],
        price: 2499,
        discount: 10,
        discountType: 'percentage',
        stock: 50,
        lowStockThreshold: 10,
        status: 'active',
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Niacinamide'],
        benefits: ['Brightens skin', 'Reduces dark spots', 'Hydrates'],
        tags: ['serum', 'brightening', 'vitamin-c'],
      },
      {
        name: 'Hydra Moisturizer',
        slug: 'hydra-moisturizer',
        description: 'Lightweight, oil-free moisturizer that provides 24-hour hydration while controlling excess oil and shine.',
        shortDescription: 'Oil-free hydrating moisturizer',
        category: skincareCategory._id,
        brand: 'GlowRoot',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
            publicId: 'moisturizer-1',
            alt: 'Hydra Moisturizer',
            isPrimary: true
          }
        ],
        price: 1899,
        discount: 0,
        discountType: 'percentage',
        stock: 75,
        lowStockThreshold: 15,
        status: 'active',
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        ingredients: ['Hyaluronic Acid', 'Aloe Vera', 'Green Tea Extract'],
        benefits: ['Hydrates', 'Controls oil', 'Non-greasy'],
        tags: ['moisturizer', 'hydration', 'oil-free'],
      },
      {
        name: 'Gentle Cleansing Foam',
        slug: 'gentle-cleansing-foam',
        description: 'Soft, creamy cleanser that removes impurities without stripping natural oils, leaving skin feeling fresh and clean.',
        shortDescription: 'Gentle daily face cleanser',
        category: skincareCategory._id,
        brand: 'GlowRoot',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
            publicId: 'cleanser-1',
            alt: 'Gentle Cleansing Foam',
            isPrimary: true
          }
        ],
        price: 999,
        discount: 15,
        discountType: 'percentage',
        stock: 100,
        lowStockThreshold: 20,
        status: 'active',
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        ingredients: ['Aloe Vera', 'Chamomile', 'Vitamin E'],
        benefits: ['Gentle cleansing', 'Maintains moisture', 'Soothes skin'],
        tags: ['cleanser', 'gentle', 'daily-care'],
      },
      {
        name: 'Repair Hair Mask',
        slug: 'repair-hair-mask',
        description: 'Intensive treatment mask that repairs damaged hair, restores strength, and adds brilliant shine.',
        shortDescription: 'Deep conditioning hair treatment',
        category: haircareCategory._id,
        brand: 'GlowRoot',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800',
            publicId: 'hairmask-1',
            alt: 'Repair Hair Mask',
            isPrimary: true
          }
        ],
        price: 1299,
        discount: 0,
        discountType: 'percentage',
        stock: 40,
        lowStockThreshold: 10,
        status: 'active',
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        ingredients: ['Argan Oil', 'Keratin', 'Coconut Oil'],
        benefits: ['Repairs damage', 'Adds shine', 'Strengthens'],
        tags: ['hair-mask', 'repair', 'treatment'],
      },
      {
        name: 'Nourishing Body Lotion',
        slug: 'nourishing-body-lotion',
        description: 'Rich, luxurious body lotion that deeply moisturizes and nourishes skin with natural oils and botanical extracts.',
        shortDescription: 'Deep moisturizing body lotion',
        category: bodycareCategory._id,
        brand: 'GlowRoot',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=800',
            publicId: 'lotion-1',
            alt: 'Nourishing Body Lotion',
            isPrimary: true
          }
        ],
        price: 799,
        discount: 20,
        discountType: 'percentage',
        stock: 120,
        lowStockThreshold: 25,
        status: 'active',
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        ingredients: ['Shea Butter', 'Coconut Oil', 'Vitamin E'],
        benefits: ['Deep hydration', 'Softens skin', 'Long-lasting'],
        tags: ['body-lotion', 'moisturizing', 'nourishing'],
      },
      {
        name: 'Anti-Aging Night Cream',
        slug: 'anti-aging-night-cream',
        description: 'Rich night cream that works while you sleep to reduce fine lines, wrinkles, and improve skin elasticity.',
        shortDescription: 'Overnight anti-aging treatment',
        category: skincareCategory._id,
        brand: 'GlowRoot',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800',
            publicId: 'nightcream-1',
            alt: 'Anti-Aging Night Cream',
            isPrimary: true
          }
        ],
        price: 2999,
        discount: 0,
        discountType: 'percentage',
        stock: 35,
        lowStockThreshold: 8,
        status: 'active',
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        ingredients: ['Retinol', 'Peptides', 'Hyaluronic Acid'],
        benefits: ['Reduces wrinkles', 'Improves elasticity', 'Firms skin'],
        tags: ['night-cream', 'anti-aging', 'retinol'],
      },
      {
        name: 'Volumizing Shampoo',
        slug: 'volumizing-shampoo',
        description: 'Lightweight shampoo that adds volume and body to fine, flat hair while gently cleansing and nourishing.',
        shortDescription: 'Volume-boosting shampoo',
        category: haircareCategory._id,
        brand: 'GlowRoot',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800',
            publicId: 'shampoo-1',
            alt: 'Volumizing Shampoo',
            isPrimary: true
          }
        ],
        price: 899,
        discount: 10,
        discountType: 'percentage',
        stock: 80,
        lowStockThreshold: 15,
        status: 'active',
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        ingredients: ['Biotin', 'Keratin', 'Vitamin B5'],
        benefits: ['Adds volume', 'Strengthens', 'Gentle cleanse'],
        tags: ['shampoo', 'volume', 'biotin'],
      },
      {
        name: 'Exfoliating Body Scrub',
        slug: 'exfoliating-body-scrub',
        description: 'Gentle body scrub with natural exfoliants that removes dead skin cells, revealing smooth, radiant skin.',
        shortDescription: 'Natural body exfoliator',
        category: bodycareCategory._id,
        brand: 'GlowRoot',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800',
            publicId: 'scrub-1',
            alt: 'Exfoliating Body Scrub',
            isPrimary: true
          }
        ],
        price: 699,
        discount: 0,
        discountType: 'percentage',
        stock: 60,
        lowStockThreshold: 12,
        status: 'active',
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        ingredients: ['Sea Salt', 'Sugar', 'Coconut Oil'],
        benefits: ['Exfoliates', 'Smooths skin', 'Improves circulation'],
        tags: ['body-scrub', 'exfoliating', 'natural'],
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedProducts();
