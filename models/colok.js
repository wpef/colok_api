var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DebtSchema = require('./debt');
var PaymentSchema = require('./payment');

var ColokSchema = new Schema({
  name: { 
  	type: String, 
  	unique: true, 
  	required: true 
  },
  email: { 
  	type : String, 
  	required : true,
  	match : /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    unique : true,
  },
  password : { type : String, required : true },
  debts: [{ type: Schema.Types.ObjectId, ref: 'Debt' }],
  payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }]
});

ColokSchema.methods.getDebts = function() {
  var total = 0;

  debts.forEach(function(debt) {
    total = total + debt.price;
  });

  return total;
};

module.exports = mongoose.model('Colok', ColokSchema);
