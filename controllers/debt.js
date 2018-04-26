var Payment = require('../models/payment');
var Debt	= require('../models/debt');


//GET '/debts/'
//Used to list all debts
exports.list_all = function(req,res, next) {

	Debt.find(function(err, debts) {
			if (err) next(err);
			
			res.json(debts);
	});
};

//POST '/debts'
//Used to add a debt to the DB
exports.add = function(req,res, next) {

	var debt 		= new Debt();
		debt.from	= req.body.from;
		debt.price	= req.body.price;
		debt.to		= req.body.to;
		debt.paid 	= false;


	// save the debt and check for errors
	debt.save(function(err, saved) {
		if (err) next(err);
		
		res.json({ debt : saved, message: 'Debt sucessfully created!' });
	});
};

//GET '/debts/:debt_id'
exports.getBy_id = function(req, res, next) {
	Debt
	.findById(req.params.debt_id, function(err, debt) {
		if (err) next(err);
		if (!debt) next({ status : 404, message : 'Debt not found' });
	})
	.populate('from').populate('to').exec(function (err, populated) {
		if (err) next(err);
		
		res.json({ debt : populated });
	});
};

//PUT '/debts/:debt_id'
//Used to update a debt
exports.update = function(req, res, next) {

	Debt.findById(req.params.debt_id, function(err, debt) {
		if (err) next(err);

		var body = req.body;

		debt.from = body.from ? body.from : debt.from;
		debt.price = body.price ? body.price : debt.price;
		debt.to = body.to ? body.to : debt.to;
		debt.paid = body.paid ? body.paid : debt.paid;

		debt.save(function (err, saved) {
			if (err) next(err);
			
			res.json({
					debt: saved,
					message: 'Debt sucessfully updated!' });

		});
	});
};

//DELETE '/debts/:debt_id'
//Used to delete a debt
exports.delete = function(req, res, next) {
	Debt.remove({ _id: req.params.debt_id }, function(err, debt) {
		
		if (err) next(err);
		
		res.json({ message: 'Debt sucessfully deleted!' });
	});
};


//POST 'debts/:payment_id/add'
//Used to add a debt to DB from a payment
exports.addFromPayment = function(req, res, next) {

	Payment.findById(req.params.payment_id, function(err, payment) {
		if (err) next(err);

		if (payment.debt_added == false) {

			var total = payment.price;
			var shared = total / payment.n;

			var debt = [];

			payment.sharers.forEach(function (s) {

				if (s != payment.owner) {

					debt.push( new Debt({
						from	: s,
						price	: shared,
						to		: payment.owner,
					}));
				}

			});

			debt.forEach(function (d) {

				d.save(function(err) {
					if (err) next(err);
					console.log('Debt sucessfully created!');
				});

			});

			payment.debt_added = true;
			payment.save(function(err) {
				if (err) next(err);
				console.log('Payment sucessfully updated!');
			});

			res.json({ Total : payment.price, "Debts created" : debt});
		}

		else
			res.json({ message : 'Debts already posted'});

	});
};

