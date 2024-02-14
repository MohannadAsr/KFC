const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { Processes, Products, Users } = require('../models'); // Adjust the path accordingly
const { getaccessToken } = require('./usersController');

exports.resetDatabase = catchAsync(async (req, res) => {
  const admin = await Users.findOne({ where: { role: 'admin' } });
  // Use the destroy method with the transaction option
  await Users.destroy({ where: {}, truncate: false });
  await Products.destroy({ where: {}, truncate: false });
  await Processes.destroy({ where: {}, truncate: false });

  // // Create a default user within the transaction
  const newAdmin = await Users.create({
    id: admin.id,
    name: admin.name,
    code: admin.code,
    role: 'admin',
    createdAt: new Date(admin.createdAt),
  });

  const token = getaccessToken(newAdmin.id, newAdmin.code);

  res.json({ status: 200, token: token });
});
