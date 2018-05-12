var Payment = require("../models/payment");
var Debt = require("../models/debt");
var Colok = require("../models/colok");
var bcrypt = require("bcrypt");

//GET '/coloks/'
//Used to list all coloks
exports.list_all = function(req, res, next) {
  Colok.find()
    .select("_id name debts payments")
    .exec(function(err, docs) {
      var response = {
        count: docs.length,
        coloks: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            url: "http://localhost:8080/api/coloks/" + doc._id
          };
        })
      };

      if (err) return next(err);

      res.json(response);
    });
};

//POST '/coloks'
//Used to add a colok to the DB
exports.add = function(req, res, next) {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) return next(err);

    var colok = new Colok();
    colok.name = req.body.name;
    colok.email = req.body.email;
    colok.password = req.body.password ? hash : '';
    colok.debts = [];
    colok.payments = [];

    // save the colok and check for errors
    colok.save(function(err, saved) {
      if (err) return next(err);

      var response = {
        message: "Colok sucessfully created!",
        colok: {
          _id: colok._id,
          name: colok.name,
          url: "http://localhost:8080/api/coloks/" + colok._id
        }
      };

      res.json(response);
    });
  });
};

//GET '/coloks/:colok_id'
exports.getBy_id = function(req, res, next) {
  Colok.findById(req.params.colok_id, function(err, colok) {
    if (err) return next(err);
    if (!colok) next({ status: 404, message: "Colok not found" });
  })
    .populate("debts")
    .populate("payments")
    .exec(function(err, populated) {
      if (err) return next(err);

      var response = {
        colok: {
          _id: populated._id,
          name: populated.name,
          debts: populated.debts,
          payments: populated.payments,
          url: "http://localhost:8080/api/coloks/" + populated._id
        }
      };
      res.json(response);
    });
};

//PUT '/coloks/:colok_id'
//Used to update a colok
// Waits for an array
exports.update = function(req, res, next) {
  var id = req.params.colok_id;
  var updateOps = {};

  for (var ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Colok.update({ _id: id }, { $set: updateOps }, function(err, updated) {
    if (err) return next(err);
    res.json({
      op: updated,
      message: "Colok sucessfully updated!"
    });
  });
};

//DELETE '/coloks/:colok_id'
//Used to delete a colok
exports.delete = function(req, res, next) {
  Colok.remove({ _id: req.params.colok_id }, function(err, colok) {
    if (err) return next(err);
    res.json({ message: "Colok sucessfully deleted!" });
  });
};
