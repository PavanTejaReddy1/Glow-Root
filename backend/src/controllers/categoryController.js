const Category = require('../models/Category');
const { NotFoundError, ConflictError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, image, parent, order, isFeatured, seo } = req.body;

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ConflictError('Category with this name already exists');
  }

  if (parent) {
    const parentCategory = await Category.findById(parent);
    if (!parentCategory) {
      throw new NotFoundError('Parent category not found');
    }
  }

  const category = await Category.create({
    name,
    description,
    image,
    parent,
    order,
    isFeatured,
    seo,
    createdBy: req.admin._id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    data: { category },
  });
});

const getCategories = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, parent, isFeatured, isActive } = req.query;

  const query = { isDeleted: false };

  if (parent === 'null' || parent === '') {
    query.parent = null;
  } else if (parent) {
    query.parent = parent;
  }

  if (isFeatured === 'true') query.isFeatured = true;
  if (isActive === 'true') query.isActive = true;
  if (isActive === 'false') query.isActive = false;

  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find(query)
      .populate('parent', 'name slug')
      .sort({ order: 1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Category.countDocuments(query),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id)
    .populate('parent', 'name slug')
    .populate('subcategories', 'name slug image order isFeatured');

  if (!category || category.isDeleted) {
    throw new NotFoundError('Category not found');
  }

  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category || category.isDeleted) {
    throw new NotFoundError('Category not found');
  }

  const { name, description, image, parent, order, isFeatured, isActive, seo } = req.body;

  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({ name, _id: { $ne: id } });
    if (existingCategory) {
      throw new ConflictError('Category with this name already exists');
    }
    category.name = name;
  }

  if (description !== undefined) category.description = description;
  if (image) category.image = image;
  if (parent !== undefined) {
    if (parent === '' || parent === null) {
      category.parent = null;
    } else {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        throw new NotFoundError('Parent category not found');
      }
      if (parentCategory._id.toString() === id) {
        throw new ValidationError('Category cannot be its own parent');
      }
      category.parent = parent;
    }
  }
  if (order !== undefined) category.order = order;
  if (isFeatured !== undefined) category.isFeatured = isFeatured;
  if (isActive !== undefined) category.isActive = isActive;
  if (seo) category.seo = seo;

  category.updatedBy = req.admin._id;
  await category.save();

  res.status(200).json({
    status: 'success',
    message: 'Category updated successfully',
    data: { category },
  });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category || category.isDeleted) {
    throw new NotFoundError('Category not found');
  }

  const hasSubcategories = await Category.exists({ parent: id, isDeleted: false });
  if (hasSubcategories) {
    throw new ConflictError('Cannot delete category with subcategories. Please delete or reassign subcategories first.');
  }

  category.isDeleted = true;
  category.deletedAt = new Date();
  await category.save();

  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully',
  });
});

const restoreCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category || !category.isDeleted) {
    throw new NotFoundError('Category not found or not deleted');
  }

  category.isDeleted = false;
  category.deletedAt = null;
  await category.save();

  res.status(200).json({
    status: 'success',
    message: 'Category restored successfully',
    data: { category },
  });
});

const getTopLevelCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.getTopLevel();

  res.status(200).json({
    status: 'success',
    data: { categories },
  });
});

const getFeaturedCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.getFeatured();

  res.status(200).json({
    status: 'success',
    data: { categories },
  });
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getTopLevelCategories,
  getFeaturedCategories,
};
