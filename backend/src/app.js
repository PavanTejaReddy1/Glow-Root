const express = require('express');

const cors = require('cors');

const cookieParser = require('cookie-parser');

const morgan = require('morgan');

const securityMiddleware = require('./middlewares/security');

const errorHandler = require('./middlewares/errorHandler');

const apiRoutes = require('./routes');



const app = express();



// Security middleware

securityMiddleware(app);



// CORS configuration

app.use(cors({

  origin: true,

  credentials: true,

}));



// Body parser

app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));



// Cookie parser

app.use(cookieParser());



// Logging

if (process.env.NODE_ENV === 'development') {

  app.use(morgan('dev'));

}



// Health check

app.get('/health', (req, res) => {

  res.status(200).json({

    status: 'success',

    message: 'Server is running',

    timestamp: new Date().toISOString(),

  });

});



// API Routes

app.use('/api/v1', apiRoutes);



// 404 handler

app.all('*', (req, res, next) => {

  res.status(404).json({

    status: 'fail',

    message: `Can't find ${req.originalUrl} on this server!`,

  });

});



// Global error handler

app.use(errorHandler);



module.exports = app;

