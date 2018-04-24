var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentSchema   = new Schema({
    name	: {type : String, required : true},
    price	: {type : Number, min : 0, required : true},
    owner	: {type : Schema.Types.ObjectId, required : true},
    sharers	: {type : [Schema.Types.ObjectId], required : true },
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