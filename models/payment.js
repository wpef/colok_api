var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Debt		 = require('./debt.js');

var PaymentSchema   = new Schema({
    name	: {type : String, required : true},
    price	: {type : Number, min : 0, required : true},
    owner	: {type : Schema.Types.ObjectId, ref : 'Colok', required : true},
    sharers	: [{type : Schema.Types.ObjectId, ref : 'Colok', required : true }],
    paid	: { type : Boolean, default : false },
    debt_added	: { type : Boolean, default : false } 
});

PaymentSchema.virtual('n').get(function () {
  return this.sharers.length;
});

PaymentSchema.methods.calc_debts = function() {

	var total = this.price;
	var shared = total / this.sharers.length;

	var debts = [];

	this.sharers.forEach(function (s) {

		if (String(s) == String(this.owner)) {
			total = total - shared; 
		}
		else {

			total = total - shared; 

			debts.push( new Debt({
				from	: s,
				price	: shared,
				to		: this.owner,
			}));
		}

	}, this );

	return ({ count : debts.length, debts, reste : total });
};

PaymentSchema.methods.myfunction= function(param) {
 		//anything
  };

module.exports = mongoose.model('Payment', PaymentSchema);