const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { Products } = require('../models');
const { Transactions } = require('../models');
const { Users } = require('../models');

exports.resetDatabase = catchAsync(async (req, res) => {
  const t = await sequelize.transaction();

  // Use the destroy method with the transaction option
  await Users.destroy({ where: {}, truncate: false, transaction: t });
  await Products.destroy({ where: {}, truncate: false, transaction: t });
  await Transactions.destroy({ where: {}, truncate: false, transaction: t });

  // Create a default user within the transaction
  await Users.create(
    { name: 'SuperAdmin', code: 12345, role: 'admin' },
    { transaction: t }
  );

  // Commit the transaction if everything is successful
  await t.commit();

  res.json({ status: 200, data: 'Data reset successfully' });
});
