const { globalErrorHandler } = require('../utils/errorHandler');

const errorHandler = (err, req, res, next) => {
  globalErrorHandler(err, req, res, next);
};

module.exports = errorHandler;
