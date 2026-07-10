const Product = require('../models/Product');
const Category = require('../models/Category');
const { cloudinary } = require('../config');
const { NotFoundError, ValidationError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

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
    status = 'active',
    search,
    isFeatured,
    isBestSeller,
    isNewArrival,
    minPrice,
    maxPrice,
  } = req.query;

  const query = { isDeleted: false };

  if (category) query.category = category;
  if (status) query.status = status;
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

  product.viewCount += 1;
  await product.save();

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product || product.isDeleted) {
    throw new NotFoundError('Product not found');
  }

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

  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new NotFoundError('Category not found');
    }
    product.category = category;
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (shortDescription !== undefined) product.shortDescription = shortDescription;
  if (brand) product.brand = brand;
  if (price !== undefined) product.price = price;
  if (discount !== undefined) product.discount = discount;
  if (discountType) product.discountType = discountType;
  if (stock !== undefined) product.stock = stock;
  if (lowStockThreshold !== undefined) product.lowStockThreshold = lowStockThreshold;
  if (variants) product.variants = variants;
  if (dimensions) product.dimensions = dimensions;
  if (ingredients) product.ingredients = ingredients;
  if (benefits) product.benefits = benefits;
  if (howToUse) product.howToUse = howToUse;
  if (tags) product.tags = tags;
  if (seo) product.seo = seo;
  if (status) product.status = status;
  if (isFeatured !== undefined) product.isFeatured = isFeatured;
  if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
  if (isNewArrival !== undefined) product.isNewArrival = isNewArrival;

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      alt: product.name,
      isPrimary: product.images.length === 0 && index === 0,
    }));
    product.images = [...product.images, ...newImages];
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
