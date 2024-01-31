const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { Products } = require('../models');
const { Transactions } = require('../models');
const { Users } = require('../models');

exports.resetDatabase = catchAsync(async (req, res) => {
  // Use the destroy method with the transaction option
  await Users.destroy({ where: {}, truncate: false });
  await Products.destroy({ where: {}, truncate: false });
  await Transactions.destroy({ where: {}, truncate: false });

  // Create a default user within the transaction
  await Users.create({ name: 'SuperAdmin', code: 12345, role: 'admin' });

  res.json({ status: 200, data: 'Data reset successfully' });
});
