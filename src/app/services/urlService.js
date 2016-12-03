var UrlModel = require('../models/urlModel');
var redis = require('redis');

var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;

var redisClient = redis.createClient(port, host);

var validateUrl = function(longUrl, callback) {
    var http = require('http'),
        url = require('url');
    var options = {
        method: 'HEAD',
        host: url.parse(longUrl).host,
        port: 80,
        path: url.parse(longUrl).pathname
    };
    var req = http.request(options, function(r) {
        callback({
            status: 'ok',
            data: r.headers
        });
    });
    req.on('error', function(err) {
        callback({
            status: 'failed',
            message: {'longUrl': 'This is not a valid URL.'},
            error: err
        });
    });
    req.end();
};

var getShortUrl = function(longUrl, callback) {
    // This part has been handled in the front-end, hence comment it.
    /* if (longUrl.indexOf('http') == -1) {
     longUrl = "http://" + longUrl;
     } */
    redisClient.get(longUrl, function(err, shortUrl) {
        if (shortUrl) {
            console.log('using cache');
            callback({
                status: 'ok',
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        } else {
            validateUrl(longUrl, function(output) {
                if (output.status != 'ok') {
                    callback(output);
                } else {
                    UrlModel.findOne({
                        longUrl: longUrl
                    }, function(err, data) {
                        if (data) {
                            callback({
                                status: 'ok',
                                shortUrl: data.shortUrl,
                                longUrl: data.longUrl
                            });
                            redisClient.set(data.shortUrl, data.longUrl);
                            redisClient.set(data.longUrl, data.shortUrl);
                        } else {
                            generateShortUrl(function(shortUrl) {
                                var url = new UrlModel({
                                    shortUrl: shortUrl,
                                    longUrl: longUrl
                                });
                                url.save(function() {
                                    callback({
                                        status: 'ok',
                                        shortUrl: shortUrl,
                                        longUrl: longUrl
                                    });
                                    redisClient.set(shortUrl, longUrl);
                                    redisClient.set(longUrl, shortUrl);
                                });
                            });
                        }
                    });
                }
            });
        }
    });
};

var getLongUrl = function(shortUrl, callback) {
    redisClient.get(shortUrl, function(err, longUrl) {
        if (longUrl) {
            // console.log("byebye mongo " + longUrl + " end");
            callback({
                status: 'ok',
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        } else {
            UrlModel.findOne({
                shortUrl: shortUrl
            }, function(err, data) {
                if (err) {
                    console.log(err);
                    callback({
                        status: 'failed',
                        message: err
                    });
                    return;
                }

                if (data) {
                    // console.log('data: ' + data);
                    callback({
                        status: 'ok',
                        shortUrl: shortUrl,
                        longUrl: data.longUrl
                    });
                    // console.log(data);
                    redisClient.set(shortUrl, data.longUrl);
                    redisClient.set(data.longUrl, shortUrl);
                } else {
                    callback({
                        status: 'failed',
                        shortUrl: shortUrl,
                        message: 'The short URL does not exist.'
                    });
                }
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
    var code = 'abcdefghijklmnopqrstuvwxzy';
    code += code.toUpperCase();
    code += '0123456789';
    var shortUrl = '';
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
