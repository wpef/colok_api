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
    //'mongodb://colok:mal128@ds255329.mlab.com:55329/colok_user'
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


//Load routes
var paymentsRoutes = require('./routes/payments');
var debtsRoutes 	= require('./routes/debts');

// REGISTER OUR ROUTES -------------------------------

// all of our routes will be prefixed with /api
app.use('/api/payments', paymentsRoutes);
app.use('/api/debts', debtsRoutes);
app.use('/api/coloks', debtsRoutes);


app.use( (req, res) => {
  res.status(404).send({message: req.originalUrl + ' not found'})
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
