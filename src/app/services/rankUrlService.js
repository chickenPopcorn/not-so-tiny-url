var RequestModel = require('../models/requestModel');
var UrlModel = require('../models/urlModel');
var redis = require('redis');
var PriorityQueue = require('priorityqueuejs');

var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;

var redisClient = redis.createClient(port, host);
var hashClick = '_clicks';


var getAllClicks = function(callback) {
    redisClient.hgetall(hashClick, callback);
};

var getTopKUrls = function(k, callback) {
    redisClient.hgetall(hashClick, function(err, data) {
        var queue = new PriorityQueue(function(a, b) {
            return a.clicks - b.clicks;
        });
        for (var key in data) {
            queue.enq({ shortUrl: key, clicks: data[key]});
        }
        var result = [];
        for (var i = 0; i < k; i++) {
            if (queue.isEmpty()) {
                break;
            }
            result.push(queue.deq());

        }
        callback(result);
    });
};

var saveUrlClicks = function(callback) {
    UrlModel.find({}, function(err, data) {
        if (err != null) {
            callback(err);
            return;
        }

        var count = 0;
        // console.log("length:" + data.length);
        for (var i = 0; i < data.length; i++) {
            var shortUrl = data[i].shortUrl;
            getUrlClicks(shortUrl, function(shortUrl, clicks) {
                var obj = {};
                obj[shortUrl] = clicks;
                // console.log(shortUrl, clicks);
                redisClient.hmset(hashClick, obj, function(err, data) {
                    if (err != null) {
                        callback(err);
                        return;
                    }
                });
                count++;
                // console.log(count);
                if (count === data.length) {
                    callback(err);
                }
            });
        }
    });
};

var updateUrlClicks = function(shortUrl, callback) {
    getUrlClicksCached(shortUrl, function(err, data) {
        var obj = {};
        var clicks = parseInt(data) + 1;
        obj[shortUrl] = clicks;
        redisClient.hmset(hashClick, obj, function(err, data) {
            callback(shortUrl, clicks);
        });
    });
};

var getUrlClicksCached = function(shortUrl, callback) {
    redisClient.hget(hashClick, shortUrl, function(err, data) {
        if (err == null && data == null) {
            getUrlClicks(shortUrl, function(shortUrl, data) {
                callback(shortUrl, data);
            });
        } else {
            callback(shortUrl, data);
        }
    });
};

var getUrlClicks = function(shortUrl, callback) {
    RequestModel.count({ shortUrl: shortUrl }, function(err, data) {
        //console.log(data);
        callback(shortUrl, data);
    });

};

module.exports = {
    getUrlClicks: getUrlClicks,
    saveUrlClicks: saveUrlClicks,
    getAllClicks: getAllClicks,
    getTopKUrls: getTopKUrls,
    updateUrlClicks: updateUrlClicks,
    getUrlClicksCached: getUrlClicksCached
};
