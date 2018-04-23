var Payment = require('../models/payment');
var Debt	= require('../models/debt');


//POST 'debt/:payment_id/add'
//Used to add a debt to DB from a payment
exports.add = function(req, res) {

	Payment.findById(req.params.payment_id, function(err, payment) {
		if (err) res.send(err);

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
					if (err) res.send(err);
					console.log('Debt sucessfully created!');
				});

			});

			payment.debt_added = true;
			payment.save(function(err) {
				if (err) res.send(err);
				console.log('Payment sucessfully updated!');
			});

			res.json({ Total : payment.price, "Debts created" : debt});
		}

		else
			res.json({ message : 'Debts already posted'});

	});

};