const Product = require('../models/Product');
const Category = require('../models/Category');
const { cloudinary } = require('../config');
const { NotFoundError, ValidationError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

/* Convert a value to an array of trimmed strings.
   FormData sends arrays as repeated keys OR newline/comma-joined strings. */
const toStringArray = (val) => {
  if (val === undefined || val === null || val === '') return undefined;
  if (Array.isArray(val)) return val.map(s => String(s).trim()).filter(Boolean);
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[')) {
      try { return JSON.parse(trimmed).map(s => String(s).trim()).filter(Boolean); } catch {}
    }
    return trimmed.split('\n').map(s => s.trim()).filter(Boolean);
  }
  return [String(val).trim()];
};

const createProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    shortDescription,
    category,
    brand,
    price,
    discount,
    discountType,
    stock,
    lowStockThreshold,
    variants,
    dimensions,
    ingredients,
    benefits,
    howToUse,
    tags,
    seo,
    status,
    isFeatured,
    isBestSeller,
    isNewArrival,
  } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new NotFoundError('Category not found');
  }

  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      alt: name,
      isPrimary: index === 0,
    }));
  }

  const product = await Product.create({
    name,
    description,
    shortDescription,
    category,
    brand,
    images,
    price:             price        !== undefined ? Number(price)             : undefined,
    discount:          discount     !== undefined ? Number(discount)          : 0,
    discountType:      discountType || 'percentage',
    stock:             stock        !== undefined ? Number(stock)             : 0,
    lowStockThreshold: lowStockThreshold !== undefined ? Number(lowStockThreshold) : 10,
    // Convert textarea newline strings to arrays
    ingredients: toStringArray(ingredients) || [],
    benefits:    toStringArray(benefits)    || [],
    howToUse,
    tags:        toStringArray(tags)        || [],
    seo,
    status: status || 'active',
    isFeatured:   isFeatured   === 'true' || isFeatured   === true,
    isBestSeller: isBestSeller === 'true' || isBestSeller === true,
    isNewArrival: isNewArrival === 'true' || isNewArrival === true,
    createdBy: req.admin._id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: { product },
  });
});

const getProducts = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    category,
    status,          // no default — admin sees all, public can filter
    search,
    isFeatured,
    isBestSeller,
    isNewArrival,
    minPrice,
    maxPrice,
  } = req.query;

  const query = { isDeleted: false };

  if (category) query.category = category;
  // Only filter by status if explicitly provided; public shop will pass status=active
  if (status && status !== 'all') query.status = status;
  if (isFeatured === 'true') query.isFeatured = true;
  if (isBestSeller === 'true') query.isBestSeller = true;
  if (isNewArrival === 'true') query.isNewArrival = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate('category', 'name slug');

  if (!product || product.isDeleted) {
    throw new NotFoundError('Product not found');
  }

  await Product.updateOne({ _id: product._id }, { $inc: { viewCount: 1 } });

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

const getProductBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug }).populate('category', 'name slug');

  if (!product || product.isDeleted) {
    throw new NotFoundError('Product not found');
  }

  await Product.updateOne({ _id: product._id }, { $inc: { viewCount: 1 } });

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product || product.isDeleted) throw new NotFoundError('Product not found');

  const {
    name, description, shortDescription,
    category, brand,
    price, discount, discountType,
    stock, lowStockThreshold,
    ingredients, benefits, howToUse,
    tags, status,
    isFeatured, featured,
    isBestSeller, bestSeller,
    isNewArrival, newArrival,
    seoTitle, seoDescription,
  } = req.body;

  if (category) {
    const cat = await Category.findById(category);
    if (!cat) throw new NotFoundError('Category not found');
    product.category = category;
  }

  if (name)        product.name        = name;
  if (description) product.description = description;
  if (shortDescription !== undefined) product.shortDescription = shortDescription;
  if (brand)       product.brand       = brand;
  if (status)      product.status      = status;
  if (howToUse !== undefined) product.howToUse = howToUse;

  // Numbers — FormData sends as strings
  if (price        !== undefined && price        !== '') product.price             = Number(price);
  if (discount     !== undefined && discount     !== '') product.discount          = Number(discount);
  if (stock        !== undefined && stock        !== '') product.stock             = Number(stock);
  if (lowStockThreshold !== undefined && lowStockThreshold !== '')
    product.lowStockThreshold = Number(lowStockThreshold);
  if (discountType) product.discountType = discountType;

  // Array fields — textarea sends newline-separated strings
  const ing = toStringArray(ingredients);
  const ben = toStringArray(benefits);
  const tgs = toStringArray(tags);
  if (ing) product.ingredients = ing;
  if (ben) product.benefits    = ben;
  if (tgs) product.tags        = tgs;

  // SEO
  if (seoTitle || seoDescription) {
    product.seo = {
      ...(product.seo || {}),
      ...(seoTitle       ? { metaTitle:       seoTitle       } : {}),
      ...(seoDescription ? { metaDescription: seoDescription } : {}),
    };
  }

  // Booleans — accept both naming conventions & string "true"/"false"
  const toBool = v => v === 'true' || v === true;
  const featuredVal   = isFeatured   !== undefined ? isFeatured   : featured;
  const bestSellerVal = isBestSeller !== undefined ? isBestSeller : bestSeller;
  const newArrivalVal = isNewArrival !== undefined ? isNewArrival : newArrival;
  if (featuredVal   !== undefined) product.isFeatured   = toBool(featuredVal);
  if (bestSellerVal !== undefined) product.isBestSeller = toBool(bestSellerVal);
  if (newArrivalVal !== undefined) product.isNewArrival = toBool(newArrivalVal);

  // ── Images ──────────────────────────────────────────────────────
  // keepImageIds: "id1:true,id2:false" — existing images to retain + their isPrimary flag
  // primaryNewIndex: index (0-based) of which new uploaded image is primary
  const { keepImageIds, primaryNewIndex } = req.body;

  if (keepImageIds !== undefined) {
    // Parse "id:isPrimary" pairs
    const keepEntries = keepImageIds
      ? keepImageIds.split(',').map(s => {
          const [imgId, primary] = s.trim().split(':');
          return { imgId: imgId?.trim(), isPrimary: primary === 'true' };
        }).filter(e => e.imgId)
      : [];

    const keepIds = keepEntries.map(e => e.imgId);

    // Delete removed images from Cloudinary
    for (const img of product.images) {
      if (!keepIds.includes(img._id.toString()) && img.publicId) {
        try {
          await cloudinary.cloudinary.uploader.destroy(img.publicId);
        } catch (e) {
          console.warn('Cloudinary delete failed for', img.publicId, e.message);
        }
      }
    }

    // Keep only selected images, updating their isPrimary flags
    product.images = product.images
      .filter(img => keepIds.includes(img._id.toString()))
      .map(img => {
        const entry = keepEntries.find(e => e.imgId === img._id.toString());
        return { ...img.toObject(), isPrimary: entry?.isPrimary || false };
      });
  }

  // Append newly uploaded images
  if (req.files && req.files.length > 0) {
    const primIdx = primaryNewIndex !== undefined ? Number(primaryNewIndex) : -1;
    const newImages = req.files.map((file, idx) => ({
      url:       file.path,
      publicId:  file.filename,
      alt:       product.name,
      isPrimary: primIdx >= 0 ? idx === primIdx : false,
    }));
    product.images = [...product.images, ...newImages];
  }

  // Ensure exactly one primary — if none set, make first one primary
  if (product.images.length > 0) {
    const primaryCount = product.images.filter(img => img.isPrimary).length;
    if (primaryCount === 0) {
      product.images[0].isPrimary = true;
    } else if (primaryCount > 1) {
      // Keep only the first primary
      let found = false;
      product.images = product.images.map(img => {
        if (img.isPrimary && !found) { found = true; return img; }
        return { ...img.toObject ? img.toObject() : img, isPrimary: false };
      });
    }
  }

  product.updatedBy = req.admin._id;
  await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Product updated successfully',
    data: { product },
  });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product || product.isDeleted) {
    throw new NotFoundError('Product not found');
  }

  product.isDeleted = true;
  product.deletedAt = new Date();
  await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully',
  });
});

const archiveProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product || product.isDeleted) {
    throw new NotFoundError('Product not found');
  }

  product.status = 'archived';
  await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Product archived successfully',
    data: { product },
  });
});

const restoreProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product || !product.isDeleted) {
    throw new NotFoundError('Product not found or not deleted');
  }

  product.isDeleted = false;
  product.deletedAt = null;
  await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Product restored successfully',
    data: { product },
  });
});

const deleteProductImage = asyncHandler(async (req, res, next) => {
  const { id, imageId } = req.params;

  const product = await Product.findById(id);

  if (!product || product.isDeleted) {
    throw new NotFoundError('Product not found');
  }

  const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
  if (imageIndex === -1) {
    throw new NotFoundError('Image not found');
  }

  const image = product.images[imageIndex];
  
  try {
    await cloudinary.cloudinary.uploader.destroy(image.publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }

  product.images.splice(imageIndex, 1);
  
  if (product.images.length > 0 && !product.images.some(img => img.isPrimary)) {
    product.images[0].isPrimary = true;
  }

  await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Image deleted successfully',
    data: { product },
  });
});

const setPrimaryImage = asyncHandler(async (req, res, next) => {
  const { id, imageId } = req.params;

  const product = await Product.findById(id);

  if (!product || product.isDeleted) {
    throw new NotFoundError('Product not found');
  }

  const imageExists = product.images.some(img => img._id.toString() === imageId);
  if (!imageExists) {
    throw new NotFoundError('Image not found');
  }

  product.images.forEach(img => {
    img.isPrimary = img._id.toString() === imageId;
  });

  await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Primary image set successfully',
    data: { product },
  });
});

const getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.getFeatured().populate('category', 'name slug');

  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

const getBestSellers = asyncHandler(async (req, res, next) => {
  const products = await Product.getBestSellers().populate('category', 'name slug');

  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

const getNewArrivals = asyncHandler(async (req, res, next) => {
  const products = await Product.getNewArrivals().populate('category', 'name slug');

  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

const searchProducts = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    throw new ValidationError('Search query is required');
  }

  const products = await Product.search(q).populate('category', 'name slug');

  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  archiveProduct,
  restoreProduct,
  deleteProductImage,
  setPrimaryImage,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  searchProducts,
};
