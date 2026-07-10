const dotenv = require('dotenv');
const app = require('./app');
const { database } = require('./config');

dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Connect to database
    await database();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
