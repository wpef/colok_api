var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentSchema   = new Schema({
    name	: String,
    price	: Number,
    owner	: String,
    sharer	: [String],
});

module.exports = mongoose.model('payment', PaymentSchema);