/**
 * Created by dyorex on 2016-10-14.
 */
var mongoose = require("mongoose");

var userModel = mongoose.model('User', new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    fullname: String,
    accessToken: String
}));

module.exports = userModel;
