var Payment = require('../models/payment');
var Debt	= require('../models/debt');
var Colok	= require('../models/colok');


//GET '/coloks/'
//Used to list all coloks
exports.list_all = function(req,res) {

	Colok.find(function(err, coloks) {
			if (err) res.send(err);
			
			res.json(coloks);
	});
};

//POST '/coloks'
//Used to add a colok to the DB
exports.add = function(req,res) {

	var colok 		= new Colok();
		colok.name	= req.body.name;
		colok.debts	= []; //TODO
		colok.payments	= []; //TODO


	// save the colok and check for errors
	colok.save(function(err, saved) {
		if (err)
			res.status(400).send(err);
		else
			res.json({ colok : saved, message: 'Colok sucessfully created!' });
	});
};

//GET '/coloks/:colok_id'
exports.getBy_id = function(req, res) {
	Colok.findById(req.params.colok_id, function(err, colok) {
		if (err) res.status(400).send(err);
		else if (!colok) res.status(404).send({message : 'Colok not found'});
		else res.json({ colok : colok });
	});
};

//PUT '/coloks/:colok_id'
//Used to update a colok
exports.update = function(req, res) {

	Colok.findById(req.params.colok_id, function(err, colok) {
		if (err) res.send(err);

		var body = req.body;

		colok.name = body.name ? body.name : colok.name;
		colok.debts = body.debts ? body.debts : colok.debts;
		colok.payments = body.payments ? body.payments : colok.payments;

		colok.save(function (err, saved) {
			if (err)
				res.send(err);
			else
				res.json({
					colok: saved,
					message: 'Colok sucessfully updated!' });

		});
	});
};

//DELETE '/coloks/:colok_id'
//Used to delete a colok
exports.delete = function(req, res) {
	Colok.remove({ _id: req.params.colok_id }, function(err, colok) {
		
		if (err)
			res.status(400).send(err);
		else
			res.json({ message: 'Colok sucessfully deleted!' });
	});
};