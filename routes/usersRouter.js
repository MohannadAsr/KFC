const express = require('express');

const router = express.Router();
const userController = require('../controllers/usersController');

router
  .route('/')
  .get(userController.protectRoute, userController.getAllUsers)
  .post(
    userController.protectRoute,
    userController.restrictTo('admin'),
    userController.createUser
  );

router.route('/login').post(userController.login);

module.exports = router;
