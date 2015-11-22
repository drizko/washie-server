// app/models/transaction.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TransactionSchema   = new Schema({
    user_email      : String,
    washer_email    : String,
    price_paid      : String,
    vehicle_type    : String,
    location        : String,
    wash_level      : String,

});

module.exports = mongoose.model('Transaction', TransactionSchema);
