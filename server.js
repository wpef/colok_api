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

//Loading models
var Payment = require('./models/payment');
var Debt = require('./models/debt');

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


// HOME
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });   
});


//Load controllers
var payment = require('./controllers/payment');
var debt 	= require('./controllers/debt');


//Create routes method
router.route('/payment')
    .get(payment.list_all)
    .post(payment.add);

router.route('/payment/:payment_id')
    .get(payment.getBy_id)
    .put(payment.update)
    .delete(payment.delete);

router.route('/payment/:payment_id/debt')
	.get(payment.calc_debt);

router.route('/debt/:payment_id/add')
    .post(debt.add);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
