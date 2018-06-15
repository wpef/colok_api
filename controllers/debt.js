var Payment = require('../models/payment');
var Debt = require('../models/debt');

//GET '/debts/'
//Used to list all debts
exports.list_all = function(req, res, next) {
  Debt.find()
    .populate('from')
    .populate('to')
    .exec()
    .then(function(debts) {
      var response = {
        count: debts.length,
        debts: debts.map(debt => {
          return {
            id: debt._id,
            from: debt.from.name,
            to: debt.to.name,
            price: debt.price,
            url: 'http://localhost:8080/api/debts/' + debt._id
          };
        })
      };

      res.json(response);
    })
    .catch(error => {
      next(error);
    });
};

//POST '/debts'
//Used to add a debt to the DB
exports.add = function(req, res, next) {
  var debt = new Debt();
  debt.from = req.body.from;
  debt.price = req.body.price;
  debt.to = req.body.to;
  debt.paid = false;

  // save the debt and check for errors
  debt.save(function(err, saved) {
    if (err) return next(err);

    res.json({ debt: saved, message: 'Debt sucessfully created!' });
  });
};

//GET '/debts/:debt_id'
exports.getBy_id = function(req, res, next) {
  Debt.findById(req.params.debt_id, function(err, debt) {
      if (err) return next(err);
      if (!debt) {
      return next({ status: 404, message: 'Debt not found' });
    }

      var response = {
        debt,
        url: 'http://localhost:8080/api/debts/' + debt._id
      };

      res.json(response);
    });
};

//PUT '/debts/:debt_id'
//Used to update a debt
exports.update = function(req, res, next) {
  var id = req.params.debt_id;
  var updateOps = {};

  for (var ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Debt.update({ _id: id }, { $set: updateOps }, function(err, updated) {
    if (err) return next(err);
    res.json({
      op: updated,
      message: 'Debt sucessfully updated!'
    });
  });
};

//DELETE '/debts/:debt_id'
//Used to delete a debt
exports.delete = function(req, res, next) {
  Debt.remove({ _id: req.params.debt_id }, function(err, debt) {
    if (err) return next(err);

    res.json({ message: 'Debt sucessfully deleted!' });
  });
};

exports.getFromUser = function(req, res, next) {
  let user = req.params.user;

  let q = { from : user };
  
  Debt
    .find(q, function (err, debts) {
      if (err) return next(err);
      if (!debts) return next({ status: 404, message: 'No debts found for this user' });

      //calculate total
      let total = 0;
      debts.forEach((debt) => {
        total = total + debt.price;
      });

      let response = {
        total : total,
        debts,
      };

      res.json(response);

    });

};

exports.getToUser = function(req, res, next) {
  let user = req.params.user;

  let q = { to : user };
  
  Debt
    .find(q, function (err, debts) {
      if (err) return next(err);
      if (!debts || debts.length === 0)
        return next({ status: 404, message: 'No debts found for this user' });

      //calculate total
      let total = 0;
      debts.forEach((debt) => {
        total = total + debt.price;
      });

      let response = {
        total : total,
        debts,
      };

      res.json(response);

    });

};

exports.getForUser = function(req, res, next) {
  let user = req.params.user;
  
  Debt
    .find()
    .or([{ from: user }, { to: user }])
    .exec( function (err, debts) {
      if (err) return next(err);
      if (!debts) return next({ status: 404, message: 'No debts found for this user' });

      //calculate total
      let total = 0;
      let result = {
        debtsArray : {
          toGet : [],
          toGive : [], 
        },
        debtsTotal : {
          toGet : [
          ],
          toGive : [
          ],
        }
      }

      let debtsArray = result.debtsArray;

      debts.forEach((debt) => {
        if (debt.from == user) {
          debtsArray.toGive.push({ debt: debt, to : debt.to, price : debt.price });
        } else if (debt.to == user ) {
          debtsArray.toGet.push({ from : debt.from, price : debt.price });
        }
      });

      const to = [];
      debtsArray.toGive.forEach((debt) => {

          to[debt.to] = to[debt.to] ? to[debt.to] + debt.price : debt.price;

      });

      console.log(to);
      result.debtsTotal = { toGive : to };

      let response = {
        user : user,
        result : result,
        //debts,
      };

      res.json(response);

    });

};

//POST 'debts/:payment_id/add'
//Used to add a debt to DB from a payment
exports.addFromPayment = function(req, res, next) {
  Payment.findById(req.params.payment_id, function(err, payment) {
    if (err) return next(err);

    if (payment.debt_added == false) {
      var total = payment.price;
      var shared = total / payment.n;

      var debt = [];

      payment.sharers.forEach(function(s) {
        if (s != payment.owner) {
          debt.push(
            new Debt({
              from: s,
              price: shared,
              to: payment.owner
            })
          );
        }
      });

      debt.forEach(function(d) {
        d.save(function(err) {
          if (err) return next(err);
          console.log('Debt sucessfully created!');
        });
      });

      payment.debt_added = true;
      payment.save(function(err) {
        if (err) return next(err);
        console.log('Payment sucessfully updated!');
      });

      res.json({ Total: payment.price, 'Debts created': debt });
    } else res.json({ message: 'Debts already posted' });
  });
};
