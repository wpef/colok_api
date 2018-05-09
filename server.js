// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');

//Setting up mogoDB
mongoose.connect(
  'mongodb://colok:mal128@ds155299.mlab.com:55299/colok',
  //'mongodb://colok:mal128@ds255329.mlab.com:55329/colok_user',
  function(error) {
    if (error) console.log(error);
  }
);

//Loading models
var Payment = require('./models/payment');
var Debt = require('./models/debt');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================

//Load routes
var paymentsRoutes = require('./routes/payments');
var debtsRoutes = require('./routes/debts');
var coloksRoutes = require('./routes/coloks');

// REGISTER OUR ROUTES -------------------------------

// all of our routes will be prefixed with /api
app.use('/api/payments', paymentsRoutes);
app.use('/api/debts', debtsRoutes);
app.use('/api/coloks', coloksRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      error : error
    }
  });
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('\nMagic happens on port ' + port + '\n');
