/**
 * Created by dyorex on 2016-10-15.
 */
var userUrlModel = require("../models/userUrlModel");
var redis = require("redis");

var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;

var redisClient = redis.createClient(port, host);

var add = function(userId, shortUrl, isPublic, callback) {
    if (userId != '-1') {
        var userUrl = new userUrlModel({
            userId: userId,
            shortUrl: shortUrl,
            timestamp: Date.now(),
            public: isPublic
        });
        userUrl.save();
        callback(userUrl);
    } else {
        callback({ message: 'No userId.' });
    }
};

var getFeed = function(pageSize, lastId, callback) {
    // console.log('lastId: ' + lastId);
    pageSize = parseInt(pageSize);
    if (lastId != -1) {
        console.log('Here is lastId != -1');
        userUrlModel
            .find({ '_id': { $lt: lastId }, 'public': true })
            .sort({ '_id': -1 })
            .limit(pageSize)
            .exec(function(err, data){
                callback(data);
            });
    } else {
        console.log('Here is lastId == -1');
        userUrlModel
            .find({ 'public': true })
            .sort({ '_id': -1 })
            .limit(pageSize)
            .exec(function(err, data){
                if (err) {
                    callback(err);
                    return;
                }
                callback(data);
            });
    }
};

module.exports = {
    add: add,
    getFeed: getFeed
};