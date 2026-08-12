const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const { authenticateAdmin, authorize } = require('../middlewares/adminAuth');

router
  .route('/')
  .get(authenticateAdmin, authorize('customers'), getAllCustomers);

router
  .route('/:id')
  .get(authenticateAdmin, authorize('customers'), getCustomerById)
  .put(authenticateAdmin, authorize('customers'), updateCustomer)
  .delete(authenticateAdmin, authorize('customers'), deleteCustomer);

module.exports = router;
