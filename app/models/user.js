// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    firstName   : String,
    lastName    : String,
    email       : String,
    mobile      : String,
    password    : String
});

UserSchema.static('findByName', function (name, callback) {
  return this.find({ name: name }, callback);
});

module.exports = mongoose.model('User', UserSchema);
