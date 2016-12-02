/**
 * Created by dyorex on 2016-10-14.
 */
var mongoose = require('mongoose');

var userUrlModel = mongoose.model('UserUrl', new mongoose.Schema({
    userId: String,
    fullname: String,
    shortUrl: String,
    longUrl: String,
    timestamp: String,
    public: Boolean,
    isDeleted: Boolean
}));

module.exports = userUrlModel;
