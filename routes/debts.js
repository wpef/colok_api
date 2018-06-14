var express = require('express');
var router = express.Router();

//Load controllers
var debtControl = require('../controllers/debt');

//Create Routes
//Create routes method
router
  .route('/')
  .get(debtControl.list_all)
  .post(debtControl.add);

router
  .route('/:debt_id')
  .get(debtControl.getBy_id)
  .patch(debtControl.update)
  .delete(debtControl.delete);

router
	.route('/from/:user')
	.get(debtControl.getFromUser);

router
	.route('/to/:user')
	.get(debtControl.getToUser);

router
	.route('/:payment_id/add')
	.post(debtControl.addFromPayment);

module.exports = router;
