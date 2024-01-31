const express = require('express');

const router = express.Router();
const resetController = require('../controllers/resetController');

router.route('/').post(resetController.resetDatabase);

module.exports = router;
