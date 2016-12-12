var geoip = require('geoip-lite');
var RequestModel = require('../models/requestModel');
var UrlModel = require('../models/urlModel');
var rankUrlService = require('../services/rankUrlService');
var requestIp = require('request-ip');
var redis = require('redis');

var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;

var redisClient = redis.createClient(port, host);
var hashClick = '_clicks';

var logRequest = function(shortUrl, req) {
    var reqInfo = {};
    reqInfo.shortUrl = shortUrl;
    reqInfo.referer = req.headers.referer || 'Unknown';
    reqInfo.platform = req.useragent.platform || 'Unknown';
    reqInfo.browser = req.useragent.browser || 'Unknown';
    var ip = requestIp.getClientIp(req);
    var geo = geoip.lookup(ip);
    if (geo) {
        reqInfo.country = geo.country;
    } else {
        reqInfo.country = 'Unknown';
    }
    reqInfo.timestamp = new Date();

    redisClient.keys('*', function(err, data) {
        console.log(data);
        if (data.length > 0) {
            if (data.indexOf(shortUrl) > -1) {
                var request = new RequestModel(reqInfo);
                request.save(function(err, data) {
                    if (err != null) {
                        console.log(err);
                        return;
                    }
                    // console.log('request saved: ' + data);
                    if (data.shortUrl != 'undefined'
                        && data.shortUrl != 'favicon.ico') {
                        rankUrlService.updateUrlClicks(data.shortUrl,
                            function(url, data) {
                                if (url != shortUrl) {
                                    console.log(url);
                                }
                        });
                    }
                });
            }
        } else {
            // var reg = /[abc]*\/[abc]*/i;
            // RequestModel.remove({shortUrl: reg}, function(err, data) {
            //     console.log(data);
            // });
            UrlModel.find({shortUrl: shortUrl}, function(err, data) {
                var request = new RequestModel(reqInfo);
                request.save(function(err, data) {
                    if (err != null) {
                        console.log(err);
                        return;
                    }
                    // console.log('request saved: ' + data);
                    if (data.shortUrl != 'undefined'
                        && data.shortUrl != 'favicon.ico') {
                        rankUrlService.updateUrlClicks(data.shortUrl,
                            function(url, data) {
                                if (url != shortUrl) {
                                    console.log(url);
                                }
                            });
                    }
                });
            })
        }
    });
};

var getUrlInfo = function(shortUrl, info, callback) {
    if (info === 'totalClicks') {
        RequestModel.count({shortUrl: shortUrl}, function(err, data) {
            callback(data);
        });
        return;
    }

    var groupId = '';

    if (info === 'hour') {
        groupId = {
            year: {$year: '$timestamp'},
            month: {$month: '$timestamp'},
            day: {$dayOfMonth: '$timestamp'},
            hour: {$hour: '$timestamp'},
            minutes: {$minute: '$timestamp'}
        };
    } else if (info === 'day') {
        groupId = {
            year: {$year: '$timestamp'},
            month: {$month: '$timestamp'},
            day: {$dayOfMonth: '$timestamp'},
            hour: {$hour: '$timestamp'}
        };
    } else if (info === 'month') {
        groupId = {
            year: {$year: '$timestamp'},
            month: {$month: '$timestamp'},
            day: {$dayOfMonth: '$timestamp'}
        };
    } else {
        groupId = '$' + info;
    }

    RequestModel.aggregate([
        {
            $match: {
                shortUrl: shortUrl
            }
        },
        {
            $sort: {
                timestamp: -1
            }
        },
        {
            $group: {
                _id: groupId,
                count: {
                    $sum: 1
                }
            }
        }
    ], function(err, data) {
        callback(data);
    });
};

module.exports = {
    logRequest: logRequest,
    getUrlInfo: getUrlInfo
};
