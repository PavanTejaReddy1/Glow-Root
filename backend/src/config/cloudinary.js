const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'glowroot',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
    ],
  },
});

const uploadProductImages = (req, res, next) => {
  const multer = require('multer');
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
      }
    },
  });

  return upload.array('images', 10); // Max 10 images
};

const uploadSingleImage = (req, res, next) => {
  const multer = require('multer');
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
      }
    },
  });

  return upload.single('image');
};

module.exports = {
  cloudinary,
  uploadProductImages,
  uploadSingleImage,
};
