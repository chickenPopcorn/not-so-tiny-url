/**
 * Created by dyorex on 2016-11-21.
 */
var mongoose = require("mongoose");

var commentModel = mongoose.model('Comment', new mongoose.Schema({
    userId: String,
    fullname: String,
    postId: String,
    shortUrl: String,
    message: String,
    isDeleted: Boolean
}));

module.exports = commentModel;