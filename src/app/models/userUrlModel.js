/**
 * Created by dyorex on 2016-10-14.
 */
var mongoose = require("mongoose");

var userUrlModel = mongoose.model('UserUrl', new mongoose.Schema({
    userId: String,
    shortUrl: String,
    timestamp: String,
    public: Boolean
}));

module.exports = userUrlModel;