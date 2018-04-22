var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentSchema   = new Schema({
    name	: String,
    price	: Number,
    owner	: String,
    sharers	: [String],
    paid	: { type : Boolean, default : false },
    debt_added	: { type : Boolean, default : false } 
});

PaymentSchema.virtual('n').get(function () {
  return this.sharers.length;
});

PaymentSchema.methods.myfunction= function(param) {
 		//anything
  };

module.exports = mongoose.model('Payment', PaymentSchema);