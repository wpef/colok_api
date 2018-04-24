var express		= require('express');
var router = express.Router(); 
var debtControl = require('../controllers/debt');

router.route('/debt/:payment_id/add')
    .post(debtControl.add);

module.exports = router;