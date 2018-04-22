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
	console.log(mongoose.connection);
	next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/payment')


	// create a payment (accessed at POST http://localhost:8080/api/payment)
	.post(function(req, res) {

		var payment 	= new Payment();  // create a new instance of the payment model
		payment.name	= req.body.name;  // set the payment name (comes from the request)
		payment.price	= req.body.price;
		payment.owner	= req.body.owner;
		payment.sharers	= req.body.sharers;


		// save the payment and check for errors
		payment.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Payment sucessfully created!' });
		});

	});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
