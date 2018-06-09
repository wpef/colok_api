var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Debt = require('./debt.js');

var PaymentSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, min: 0, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'Colok', required: true },
  sharers: [{ type: Schema.Types.ObjectId, ref: 'Colok', required: true }],
  paid: { type: Boolean, default: false },
  debt_added: { type: Boolean, default: false }
});

PaymentSchema.virtual('n').get(function() {
  return this.sharers.length;
});

PaymentSchema.methods.calc_debts = function() {
  
  let total = this.price;
  let reste = total % this.sharers.length;
  let toShare = total - reste;
  
  let shared = toShare / this.sharers.length; 
  var debts = [];

  this.sharers.forEach(function(s) {
    total = total - shared;

    if (String(s) !== String(this.owner)) {

      debts.push(

        new Debt({
          from: s,
          price: shared,
          to: this.owner
        })

      );
    }
  }, this);

  return { count: debts.length, debts, reste: total };
};

PaymentSchema.methods.myfunction = function(param) {
  //anything
};

module.exports = mongoose.model('Payment', PaymentSchema);
