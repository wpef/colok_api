var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DebtSchema   = new Schema({
    from	: {type : [Schema.Types.ObjectId], required : true},
    price	: {type : Number, required : true},
    to		: {type : [Schema.Types.ObjectId], required : true},
    paid	: { type : Boolean, default : false }
});

module.exports = mongoose.model('Debt', DebtSchema);