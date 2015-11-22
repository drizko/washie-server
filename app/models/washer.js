// app/models/washer.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var WasherSchema   = new Schema({
    firstName   : String,
    lastName    : String,
    email       : String,
    mobile      : String,
    password    : String
});

module.exports = mongoose.model('Washer', WasherSchema);
