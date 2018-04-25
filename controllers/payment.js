var Payment = require('../models/payment');
var Debt	= require('../models/debt');

//GET 'api/payment'
//Used to list all the payments
exports.list_all = function(req,res) {

	Payment.find(function(err, payments) {
			if (err) res.send(err);
			
			res.json(payments);
	});
};

//POST 'api/payments'
//Used to add a payment to the DB
exports.add = function(req,res) {

	var payment 		= new Payment();
		payment.name	= req.body.name;
		payment.price	= req.body.price;
		payment.owner	= req.body.owner;
		payment.sharers	= req.body.sharers;
		payment.paid 	= false;


	// save the payment and check for errors
	payment.save(function(err) {
		if (err)
			res.status(400).send(err);
		else
			res.json({ message: 'Payment sucessfully created!' });
	});
};

//GET 'api/payment/:payment_id'
exports.getBy_id = function(req, res) {
	Payment.findById(req.params.payment_id, function(err, payment) {
		if (err) res.status(400).send(err);
		else if (!payment) res.status(404).send({message : 'Payment not found'});
		else res.json({ payment : payment , effectif : payment.n });
	});
};

//PUT '/payment/:payment_id'
//Use to update a payment
//vars : String name / Number price/ String owner/ Array sharers 
exports.update = function(req, res) {

	Payment.findById(req.params.payment_id, function(err, payment) {
		if (err) res.send(err);

		var body = req.body;

		payment.name = body.name ? body.name : payment.name;
		payment.price = body.price ? body.price : payment.price;
		payment.owner = body.owner ? body.owner : payment.owner;
		payment.sharers = body.sharers ? body.sharers : payment.sharers;

		payment.save(function (err) {
			if (err)
				res.send(err);
			else
				res.json({
					payment_id: payment._id,
					payment_name : payment.name,
					message: 'Payment sucessfully updated!' });

		});
	});
};

//DELETE '/payment/:payment_id'
//Used to delete a payment
exports.delete = function(req, res) {
	Payment.remove({ _id: req.params.payment_id }, function(err, payment) {
		
		if (err)
			res.status(400).send(err);
		else
			res.json({ message: 'Payment sucessfully deleted!' });
	});
};

//GET '/payment/:payment_id/debt'
//Used to calculate the debts  from a payment (does not store the debt)
exports.calc_debt = function(req, res) {

	Payment.findById(req.params.payment_id, function(err, payment) {
		if (err) 
			res.status(400).send(err);

		else if (!payment)
			res.status(404).send({message : 'Payment not found'});

		else if (payment) {

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
