// app/models/job.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var JobSchema    = new Schema({
    user_email      : String,
    status          : String,
    vehicle_type    : String,
    location        : String,
    zip_code        : String,
    wash_level      : String,
    price           : String
});

module.exports = mongoose.model('Job', JobSchema);
