var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DebtSchema   = new Schema({
    from	: {type : String, required : true},
    price	: {type : Number, required : true},
    to		: {type : String, required : true},
    paid	: { type : Boolean, default : false }
});

module.exports = mongoose.model('Debt', DebtSchema);