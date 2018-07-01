var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Debt = require("./debt.js");

var PaymentSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, min: 0, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "Colok", required: true },
  sharers: [{ type: Schema.Types.ObjectId, ref: "Colok", required: true }],
  paid: { type: Boolean, default: false },
  debt_added: { type: Boolean, default: false }
});

PaymentSchema.virtual("n").get(function() {
  return this.sharers.length;
});

PaymentSchema.methods.calc_debts = function() {

  let t = Number(this.price);
  let n = this.sharers.length;

  let round = t / n;
  let shares = Math.round(round * 100) / 100;
  let r = t - Math.round((shares * n ) * 100) / 100;

  const debts = [];

  this.sharers.forEach(function(s) {

    if (String(s) !== String(this.owner)) {
      debts.push(
        new Debt({
          from: s,
          price: shares,
          to: this.owner
        })
      );
    }
  }, this);

  return { count: debts.length, debts, reste: r, payment : this };
};

PaymentSchema.methods.myfunction = function(param) {
  //anything
};

module.exports = mongoose.model("Payment", PaymentSchema);
