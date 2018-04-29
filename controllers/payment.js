var Payment = require('../models/payment');
var Debt	= require('../models/debt');

//GET 'api/payment'
//Used to list all the payments
exports.list_all = function(req,res) {

	Payment.find(function(err, docs) {
			if (err) next(err);
			
		
		var response = {
			count : docs.length,
			payments : docs.map(payment => {

				return {
					_id : payment._id,
					name : payment.name,
					debts : payment.debts,
					payments : payment.payments,
					url : 'http://localhost:8080/api/payments/' + payment._id
				}
			})
		}

		res.json( response );

	});
};

//POST 'api/payments'
//Used to add a payment to the DB
exports.add = function(req,res) {

	var payment 		= new Payment();
		payment.name	= req.body.name;
		payment.price	= req.body.price;
		payment.owner	= req.body.owner;
		payment.sharers	= req.body.sharers.split(',');
		payment.paid 	= false;


	// save the payment and check for errors
	payment.save(function(err, payment) {
		if (err) next(err);
		
		var response = {
			payment : {
				_id : payment._id,
				name : payment.name,
				debts : payment.debts,
				payments : payment.payments,
				url : 'http://localhost:8080/api/payments/' + payment._id
			}
		}

		res.json( response );
	});
};

//GET 'api/payment/:payment_id'
exports.getBy_id = function(req, res) {
	Payment
	.findById(req.params.payment_id, function(err, payment) {
		if (err) next(err);
		else if (!payment) next({status : 404, message : 'Payment not found'});
	})
	.populate('owner').populate('sharers').exec(function(err, populated) {
		res.json({ payment : populated , effectif : populated.n });
	});
};

//PUT '/payment/:payment_id'
//Use to update a payment
//vars : String name / Number price/ String owner/ Array sharers 
exports.update = function(req, res, next) {

	var id			= req.params.payment_id;
	var updateOps	= {};
	
	for (var ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}

	Payment.update({ _id : id }, {$set : updateOps }, function (err, updated) {
		if (err) next(err);
		res.json({
				op : updated,
				message : 'Payment sucessfully updated!' });
	});

};

//DELETE '/payment/:payment_id'
//Used to delete a payment
exports.delete = function(req, res) {
	Payment.remove({ _id: req.params.payment_id }, function(err, payment) {
		
		if (err) next(err);
		
		res.json({ message: 'Payment sucessfully deleted!' });
	});
};

//GET '/payment/:payment_id/debt'
//Used to calculate the debts  from a payment (does not store the debt)
exports.calc_debt = function(req, res) {

	Payment.findById(req.params.payment_id, function(err, payment) {
		if (err) next(err);
		if (!payment) next({status : 404, message : 'Payment not found'});

		if (payment) {

			var total = payment.price;
			var shared = total / payment.n;

			var debt = [];

			payment.sharers.forEach(function (s) {

				if (s == payment.owner) {
					total = total - shared; 
				}
				else {

					total = total - shared; 

					debt.push( new Debt({
						from	: s,
						price	: shared,
						to		: payment.owner,
					}));
				}

			});

			res.json({ total : payment.price, "Dettes" : debt, reste : total });

		}

	});
};
