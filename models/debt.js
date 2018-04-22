var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DebtSchema   = new Schema({
    from	: String,
    price	: Number,
    to		: String,
    paid	: { type : Boolean, default : false }
});

module.exports = mongoose.model('Debt', DebtSchema);