var Payment = require('../models/payment');
var Debt = require('../models/debt');

//GET 'api/payment'
//Used to list all the payments
exports.list_all = function(req, res) {
  Payment.find(function(err, docs) {
    if (err) return next(err);

    var response = {
      count: docs.length,
      payments: docs.map(payment => {
        return {
          _id: payment._id,
          name: payment.name,
          debts: payment.debts,
          payments: payment.payments,
          url: 'http://localhost:8080/api/payments/' + payment._id
        };
      })
    };

    res.json(response);
  });
};

//POST 'api/payments'
//Used to add a payment to the DB
exports.add = function(req, res, next) {

  //Check body
  let bodyErr = {};
  if (!req.body.name || req.body.name.length === 0 ) {
    bodyErr.message = 'Please provide a name';
    bodyErr.error = 'payment name';
  }
  else if (!req.body.price || req.body.price === 0) {
    bodyErr.message = 'Please provide a value';
    bodyErr.error = 'payment value';
  }
  else if (!req.body.sharers || req.body.sharers.length === 0) {
    bodyErr.message = 'Please provide at least one sharer';
    bodyErr.error = 'payment sharers';
  }

  if (bodyErr.message) return next(bodyErr);

  const payment = new Payment();
        payment.name = req.body.name;
        payment.price = req.body.price;
        payment.owner = req.body.owner;
        payment.paid = false;
        payment.sharers = req.body.sharers;

  // save the payment and check for errors
  payment.save(function(err, payment) {
    if (err) return next(err);

    var newDebts = payment.calc_debts();
    var savedDebts = [];

    newDebts.debts.forEach(debt => {
      debt.save(function(err, saved) {
        if (err) return next(err);
      });
    });

    var response = {
      payment: {
        _id: payment._id,
        name: payment.name,
        price: payment.price,
        owner: payment.owner,
        sharers: payment.sharers,
        debts: newDebts,
        effectif: payment.sharers.length,
        url: 'http://localhost:8080/api/payments/' + payment._id
      }
    };

    res.json(response);
  });
};

//GET 'api/payment/:payment_id'
exports.getBy_id = function(req, res) {
  Payment.findById(req.params.payment_id, function(err, payment) {
    if (err) return next(err);
    else if (!payment) next({ status: 404, message: 'Payment not found' });
  })
    .populate('owner')
    .populate('sharers')
    .exec(function(err, populated) {
      res.json({ payment: populated, effectif: populated.n });
    });
};

//PUT '/payment/:payment_id'
//Use to update a payment
//vars : String name / Number price/ String owner/ Array sharers
exports.update = function(req, res, next) {
  var id = req.params.payment_id;
  var updateOps = {};

  for (var ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Payment.update({ _id: id }, { $set: updateOps }, function(err, updated) {
    if (err) return next(err);
    res.json({
      op: updated,
      message: 'Payment sucessfully updated!'
    });
  });
};

//DELETE '/payment/:payment_id'
//Used to delete a payment
exports.delete = function(req, res) {
  Payment.remove({ _id: req.params.payment_id }, function(err, payment) {
    if (err) return next(err);

    res.json({ message: 'Payment sucessfully deleted!' });
  });
};

//POST '/payment/debug'
exports.debug = (req, res) => {
  let b = new Payment();
        b.name = req.body.name;
        b.price = req.body.price;
        b.owner = req.body.owner;
        b.paid = false;
        b.sharers = req.body.sharers;

  let d = b.calc_debts();
  res.json({d});

};