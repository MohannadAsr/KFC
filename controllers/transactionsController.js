const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { Transactions } = require('../models');
const { Products } = require('../models');
const { Users } = require('../models');
const FilterFn = require('../utils/FilterFn');

exports.createTransaction = catchAsync(async (req, res, next) => {
  const { branchId, productId, quantity } = req.body;

  // Find the product and user based on the provided IDs
  const product = await Products.findOne({ where: { id: productId } });
  const user = await Users.findOne({ where: { id: branchId } });

  if (user.role == 'worker' && quantity < 0)
    return next(new AppError('Worker Can only Deposit to warehouse', 400));

  if (user.role == 'branch' && quantity > 0)
    return next(
      new AppError('Branch Can only withdarw from the warehouse', 400)
    );

  // Check if the product and user exist
  if (!product || !user) {
    return next(new AppError('Invalid Branch or Product ID', 400));
  }

  if (product.quantity - quantity < 0)
    return next(
      new AppError('There is no enough Capacity of this product', 400)
    );

  // Create a new transaction
  const newTrans = await Transactions.create({ ...req.body });

  // Update the product quantity based on the provided quantity
  const newProductState = await Products.update(
    { quantity: product.quantity + quantity }, // Update the product quantity correctly
    { where: { id: product.id } }
  );

  res.json({
    status: 'success',
    data: { transaction: newTrans, product: newProductState },
  });
});

exports.getAllTransactions = catchAsync(async (req, res) => {
  const trans = await Transactions.findAll();
  res.json({ status: 200, data: trans });
});

exports.getTranscations = catchAsync(async (req, res, next) => {
  const whereClause = FilterFn(req.query);

  const products = await Transactions.findAll({
    where: whereClause,
  });

  res.status(200).json({ status: 'success', data: products });
});
