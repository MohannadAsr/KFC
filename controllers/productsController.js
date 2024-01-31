const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { Products } = require('../models');
const { Transactions } = require('../models');

exports.getAllProducts = catchAsync(async (req, res) => {
  try {
    const productList = await Products.findAll();
    console.log(productList);
    res.json({ status: 200, data: productList });
  } catch (error) {
    throw error;
  }
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Products.create({ ...req.body });
  res.json({ data: newProduct });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Products.destroy({ where: req.body.id });

  res
    .status(204)
    .json({ status: 'success', message: ' item Deleted Successfuly' });
});


