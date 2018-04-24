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

// HOME
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });   
});


//Load routes
var paymentRoutes = require('./routes/payment');
var debtRoutes 	= require('./routes/debt');

// REGISTER OUR ROUTES -------------------------------

// all of our routes will be prefixed with /api
app.use('/api/payment', paymentRoutes);
app.use('/api/debt', paymentRoutes);
app.use( (req, res) => {
  res.status(404).send({message: req.originalUrl + ' not found'})
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
