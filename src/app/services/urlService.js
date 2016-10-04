var UrlModel = require("../models/urlModel");
var redis = require("redis");

var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;

var redisClient = redis.createClient(port, host);

var getShortUrl = function(longUrl, callback) {
    if (longUrl.indexOf('http') == -1) {
        longUrl = "http://" + longUrl;
    }

    redisClient.get(longUrl, function(err, shortUrl) {
        if (shortUrl) {
            console.log("using cache");
            callback({
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        } else {
            UrlModel.findOne({
                longUrl: longUrl
            }, function(err, data) {
                if (data) {
                    callback(data);
                    redisClient.set(data.shortUrl, data.longUrl);
                    redisClient.set(data.longUrl, data.shortUrl);
                } else {
                    generateShortUrl(function(shortUrl) {
                        var url = new UrlModel({
                            shortUrl: shortUrl,
                            longUrl: longUrl
                        });
                        url.save();
                        callback(url);
                        redisClient.set(shortUrl, longUrl);
                        redisClient.set(longUrl, shortUrl);
                    });
                }
            });
        }
    });
};

var getLongUrl = function(shortUrl, callback) {
    redisClient.get(shortUrl, function(err, longUrl) {
        if (longUrl) {
            console.log("byebye mongo " + longUrl + " end");
            callback({
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        } else {
            UrlModel.findOne({
                shortUrl: shortUrl
            }, function(err, data) {
                callback(data);
                redisClient.set(shortUrl, longUrl);
                redisClient.set(longUrl, shortUrl);
            });
        }
    });

};

var generateShortUrl = function(callback) {
    UrlModel.count({}, function(err, num) {
        callback(convertTo62(num + 1));
    });
};

var convertTo62 = function(id) {
    var code = "abcdefghijklmnopqrstuvwxzy";
    code += code.toUpperCase();
    code += '0123456789';
    var shortUrl = "";
    while (id > 0) {
        shortUrl += code[(id - 1) % 62];
        id = parseInt(id / 62);
    }
    return shortUrl;
};

module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl
};
