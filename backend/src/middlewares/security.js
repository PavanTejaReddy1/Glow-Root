const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const securityMiddleware = (app) => {
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development
    crossOriginEmbedderPolicy: false,
  }));

  // Compression
  app.use(compression());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', limiter);

  // CORS is handled in server.js
};

module.exports = securityMiddleware;
