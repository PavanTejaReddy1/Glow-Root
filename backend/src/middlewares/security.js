const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const securityMiddleware = (app) => {
  // Helmet for security headers - more permissive for development
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  }));

  // Compression
  app.use(compression());

  // Rate Limiting - more permissive for development
  if (process.env.NODE_ENV === 'production') {
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use('/api/', limiter);
  }

  // CORS is handled in app.js
};

module.exports = securityMiddleware;
