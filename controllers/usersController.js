const { Users } = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const getaccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.createUser = catchAsync(async (req, res, next) => {
  const isAdminExist = await Users.findOne({ where: { role: 'admin' } });
  if (req.body.role == 'admin' && isAdminExist)
    return next(new AppError('Only One Admin Allowed', 400));

  const duplicateCheck = await Users.findOne({
    where: { code: req.body.code },
  });
  // If a user with the same code exists, return an error
  if (duplicateCheck) {
    return next(new AppError('User Already Exists', 401));
  }

  // Create a new user if no duplicate is found
  const newUser = await Users.create({ ...req.body });
  console.log(newUser);
  res.json({ status: 'done', data: newUser });
});

exports.getAllUsers = async (req, res) => {
  const users = await Users.findAll();
  console.log(users);
  res.json({ status: 200, data: users });
};

// Login Controller
exports.login = catchAsync(async (req, res, next) => {
  const { code } = req.body;

  // Check if the code is provided
  if (!code) {
    return next(new AppError('Please provide the code', 400));
  }

  // Check if the user exists and the code is correct
  const user = await Users.findOne({ where: { code: code } });
  if (!user) {
    return next(new AppError('Incorrect Code', 401));
  }

  // Generate and send the JWT token
  let token = getaccessToken(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

exports.protectRoute = catchAsync(async (req, res, next) => {
  // 1- Getting the token and check if it's exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(new AppError('Please Login to get access to this route', 401));

  // 2- Verify the token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3- check if user still exist

  const currentUser = await Users.findOne({ where: { id: decoded.id } });
  if (!currentUser) {
    return next(
      new AppError(
        'the user that belong to token is no longer exist or banned',
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

// Permission That Restricted to Specific Users
// Array of Allowed roles and check if the current user that requesting the data have Permission By checking his role
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have Permission to do this', 403));
    }
    next();
  };
};
