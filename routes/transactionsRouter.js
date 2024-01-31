const express = require('express');

const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const userController = require('../controllers/usersController');

router
  .route('/')
  .get(userController.protectRoute, transactionsController.getAllTransactions)
  .post(userController.protectRoute, transactionsController.createTransaction);

router
  .route('/getTransaction')
  .get(userController.protectRoute, transactionsController.getTranscations);

module.exports = router;
