var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentSchema   = new Schema({
    name	: {type : String, required : true},
    price	: {type : Number, required : true},
    owner	: {type : String, required : true},
    sharers	: {type : [String], required : true },
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