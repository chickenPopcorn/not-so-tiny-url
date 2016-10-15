/**
 * Created by dyorex on 2016-10-15.
 */
var userUrlModel = require("../models/userUrlModel");
var redis = require("redis");

var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;

var redisClient = redis.createClient(port, host);

var add = function(userId, fullname, shortUrl, longUrl, isPublic, callback) {
    if (userId != '-1') {
        var userUrl = new userUrlModel({
            userId: userId,
            fullname: fullname,
            shortUrl: shortUrl,
            longUrl: longUrl,
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
    userUrlModel.find( {'public': true } ).count(function(err, count){
        var json = { 'count': count, 'data': [] }
        if (lastId != -1) {
            // console.log('Here is lastId != -1');
            userUrlModel
                .find({ '_id': { $lt: lastId }, 'public': true })
                .sort({ '_id': -1 })
                .limit(pageSize)
                .exec(function(err, data){
                    json.data = data;
                    callback(json);
                });
        } else {
            // console.log('Here is lastId == -1');
            userUrlModel
                .find({ 'public': true })
                .sort({ '_id': -1 })
                .limit(pageSize)
                .exec(function(err, data){
                    if (err) {
                        callback(err);
                        return;
                    }
                    json.data = data;
                    callback(json);
                });
        }
    });
};

module.exports = {
    add: add,
    getFeed: getFeed
};