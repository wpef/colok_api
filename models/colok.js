var mongoose	= require('mongoose');
var Schema 		= mongoose.Schema;
var DebtSchema	= require('./debt');
var PaymentSchema = require('./payment');

var ColokSchema   = new Schema({
    name	: { type : String, unique : true, }
    debts	: [Schema.Types.ObjectId],
    payments : [Schema.Types.ObjectId],
    paid	: { type : Boolean, default : false }
});

ColokSchema.methods.getDebtsTotal = function() {
	var total = 0;
	
	debts.forEach( function (d) {
		total = total + d.price;
	});

	return total;
};

module.exports = mongoose.model('Colok', ColokSchema);