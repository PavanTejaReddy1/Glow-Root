const connectDatabase = require('./database');
const { cloudinary, uploadProductImages, uploadSingleImage } = require('./cloudinary');
const { razorpay, createRazorpayOrder, verifyRazorpayPayment, refundPayment } = require('./razorpay');
const { sendEmail } = require('./nodemailer');
const {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyEmailToken,
  verifyResetToken,
} = require('./jwt');

module.exports = {
  database: connectDatabase,
  cloudinary: {
    cloudinary,
    uploadProductImages,
    uploadSingleImage,
  },
  razorpay: {
    razorpay,
    createRazorpayOrder,
    verifyRazorpayPayment,
    refundPayment,
  },
  email: {
    sendEmail,
  },
  jwt: {
    generateAccessToken,
    generateRefreshToken,
    generateEmailVerificationToken,
    generatePasswordResetToken,
    verifyAccessToken,
    verifyRefreshToken,
    verifyEmailToken,
    verifyResetToken,
  },
};
