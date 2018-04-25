var mongoose	= require('mongoose');
var Schema 		= mongoose.Schema;
var DebtSchema	= require('./debt');
var PaymentSchema = require('./payment');

var ColokSchema   = new Schema({
    name	: { type : String, unique : true, required : true }
    debts	: [Schema.Types.ObjectId],
    payments : [Schema.Types.ObjectId],
});

ColokSchema.methods.getDebts = function() {
	var total = 0;

	debts.forEach( function (debt) {
		total = total + debt.price;
	});

	return total;
};

module.exports = mongoose.model('Colok', ColokSchema);