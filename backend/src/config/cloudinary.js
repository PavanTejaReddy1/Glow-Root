const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/* ── Check if real Cloudinary credentials are configured ─────────── */
const CLOUDINARY_CONFIGURED =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key' &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== 'your_cloudinary_api_secret';

if (CLOUDINARY_CONFIGURED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✓ Cloudinary configured');
} else {
  console.log('⚠  Cloudinary credentials not set — using local disk storage for images.');
  console.log('   Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env');
}

/* ── Local disk storage (used when Cloudinary is not configured) ─── */
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

if (!CLOUDINARY_CONFIGURED) {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

const localStorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

/* ── Cloudinary storage engine ─────────────────────────────────────  */
function getCloudinaryStorage(folder = 'glowroot') {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });
}

/* ── Multer file filter ─────────────────────────────────────────────  */
const imageFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
};

/* ── After local upload: normalise req.files to match Cloudinary shape
   Cloudinary sets file.path = secure_url and file.filename = public_id
   For local storage we replicate that so the controller works the same. */
function normalisLocalFiles(req, res, next) {
  if (CLOUDINARY_CONFIGURED) return next();
  if (req.files && Array.isArray(req.files)) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    req.files = req.files.map(f => ({
      ...f,
      path:     `${baseUrl}/uploads/${f.filename}`,   // public URL
      filename: f.filename,                             // acts as publicId
    }));
  }
  next();
}

/* ── Upload middleware factories ────────────────────────────────────  */
const uploadProductImages = () => {
  const storage = CLOUDINARY_CONFIGURED
    ? getCloudinaryStorage('glowroot/products')
    : localStorageEngine;

  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // 10 MB per file
    fileFilter: imageFilter,
  });

  // Return an array middleware that also normalises local paths
  return [upload.array('images', 10), normalisLocalFiles];
};

const uploadSingleImage = () => {
  const storage = CLOUDINARY_CONFIGURED
    ? getCloudinaryStorage('glowroot/misc')
    : localStorageEngine;

  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // 10 MB
    fileFilter: imageFilter,
  });

  return [upload.single('image'), normalisLocalFiles];
};

module.exports = { cloudinary, uploadProductImages, uploadSingleImage };
