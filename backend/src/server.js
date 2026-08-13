const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');

/* ── Vercel serverless: do NOT call app.listen() ──────────────
   Vercel imports this file as a module and calls the exported
   function for each request. We connect to MongoDB lazily so
   the connection is reused across warm invocations.
   ──────────────────────────────────────────────────────────── */
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

// Wrap the express app so Vercel can call it as a serverless function
const handler = async (req, res) => {
  await connectDB();
  return app(req, res);
};

// Export for Vercel serverless
module.exports = handler;

/* ── Local development: start HTTP server ────────────────────── */
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 4000;

  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
