// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express		= require('express');        // call express
var app 		= express();                 // define our app using express
var bodyParser 	= require('body-parser');
var mongoose	= require('mongoose');	

//Setting up mogoDB
mongoose.connect(
	'mongodb://colok:mal128@ds155299.mlab.com:55299/colok',
	function(error){
		if(error) console.log(error);
        console.log("connection successful");
	}
);

var Payment = require('./models/payment');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/payment')

	//get all payments
	.get(function(req,res) {
		Payment.find(function(err, payments) {
			if (err) res.send(err);
			res.json(payments);
		});

	})
	
	// create a payment (accessed at POST http://localhost:8080/api/payment)
	.post(function(req, res) {

		var payment 	= new Payment();  // create a new instance of the payment model
		payment.name	= req.body.name;  // set the payment name (comes from the request)
		payment.price	= req.body.price;
		payment.owner	= req.body.owner;
		payment.sharers	= req.body.sharers;
		payment.paid 	= false;


		// save the payment and check for errors
		payment.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Payment sucessfully created!' });
		});

	});

router.route('/payment/:payment_id')

    // get the payment by id (accessed at GET http://localhost:8080/api/payment/:payment_id)
    .get(function(req, res) {
        Payment.findById(req.params.payment_id, function(err, payment) {
            if (err) res.send(err);
            res.json({ payment : payment , effectif : payment.n });
        });
    })

    .put(function(req, res){
		Payment.findById(req.params.payment_id, function(err, payment) {
            if (err) res.send(err);

            var body = req.body;

            payment.name = body.name ? body.name : payment.name;
            payment.price = body.price ? body.price : payment.price;
            payment.owner = body.owner ? body.owner : payment.owner;
            payment.sharers = body.sharers ? body.sharers : payment.sharers;

            payment.save(function (err) {
            	if (err) res.send(err);

            	res.json({
            		payment_id: payment._id,
            		payment_name : payment.name,
            		message: 'Payment sucessfully updated!' });

            });
        });
	})

	.delete(function(req, res) {
        Payment.remove({
            _id: req.params.payment_id
        }, function(err, payment) {
            if (err)
                res.send(err);

            res.json({ message: 'Payment sucessfully deleted!' });
        });
    });

//TRYYYYY

router.route('/payment/:payment_id/calc')

    // get the payment by id (accessed at GET http://localhost:8080/api/payment/:payment_id)
    .get(function(req, res) {

        Payment.findById(req.params.payment_id, function(err, payment) {
            if (err) res.send(err);

            var total = payment.price;
            var shared = total / payment.n;

			var debt = [];

            payment.sharers.forEach(function (s) {

            	if (s == payment.owner) {
            		total = total - shared; 
            	}
            	else {

            		total = total - shared; 

            		debt.push({
            			debt_owner	: s,
            			debt_price	: shared,
            			debt_to		: payment.owner,
            		});
            	}
            
            });

            res.json({ total : payment.price, "Dettes" : debt, reste : total });
        });
    
    })


router.route('/payment/:payment_id/pay') 

	.put(function(req, res){
		Payment.findById(req.params.payment_id, function(err, payment) {
            if (err) res.send(err);
            
            payment.paid = true;

            payment.save(function (err) {
            	if (err) res.send(err);

            	res.json({
            		payment_id: payment._id,
            		payment_name : payment.name,
            		message: 'Payment sucessfully paid!' });

            });
        });
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
