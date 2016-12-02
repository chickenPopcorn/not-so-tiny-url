/**
 * Created by dyorex on 2016-10-15.
 */
var mongoose = require('mongoose');

var likeModel = mongoose.model('Like', new mongoose.Schema({
    userId: String,
    fullname: String,
    postId: String,
    shortUrl: String
}));

module.exports = likeModel;
