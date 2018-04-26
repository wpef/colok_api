var Payment = require('../models/payment');
var Debt	= require('../models/debt');
var Colok	= require('../models/colok');


//GET '/coloks/'
//Used to list all coloks
exports.list_all = function(req,res, next) {

	Colok.find(function(err, coloks) {
			if (err) next(err);
			
			res.json(coloks);
	});
};

//POST '/coloks'
//Used to add a colok to the DB
exports.add = function(req,res, next) {

	var colok 		= new Colok();
		colok.name	= req.body.name;
		colok.debts	= [];
		colok.payments	= [];


	// save the colok and check for errors
	colok.save(function(err, saved) {
		if (err) next(err);
		
		res.json({ colok : saved, message: 'Colok sucessfully created!' });
	});
};

//GET '/coloks/:colok_id'
exports.getBy_id = function(req, res, next) {
	Colok
	.findById(req.params.colok_id, function(err, colok) {
		if (err) next(err);
		if (!colok) next({ status : 404 , message : 'Colok not found'});
	})
	.populate('debts').populate('payments').exec(function (err, populated) {
		if (err) next(err);
		res.json({ colok : populated });
	});
};

//PUT '/coloks/:colok_id'
//Used to update a colok
exports.update = function(req, res, next) {

	Colok.findById(req.params.colok_id, function(err, colok) {
		if (err) next(err);

		var body = req.body;

		colok.name = body.name ? body.name : colok.name;
		colok.debts = body.debts ? body.debts : colok.debts;
		colok.payments = body.payments ? body.payments : colok.payments;

		colok.save(function (err, saved) {
			if (err) next(err);
			
			res.json({
				colok: saved,
				message: 'Colok sucessfully updated!' });

		});
	});
};

//DELETE '/coloks/:colok_id'
//Used to delete a colok
exports.delete = function(req, res, next) {
	Colok.remove({ _id: req.params.colok_id }, function(err, colok) {
		
		if (err) next(err);
		res.json({ message: 'Colok sucessfully deleted!' });
	});
};