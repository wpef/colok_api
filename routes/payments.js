var express		= require('express');
var router = express.Router(); 
var paymentControl = require('../controllers/payment');

//Create routes method
router.route('/')
    .get(paymentControl.list_all)
    .post(paymentControl.add);

router.route('/:payment_id')
    .get(paymentControl.getBy_id)
    .put(paymentControl.update)
    .delete(paymentControl.delete);

router.route('/:payment_id/debt')
	.get(paymentControl.calc_debt);

module.exports = router;