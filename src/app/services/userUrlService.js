/**
 * Created by dyorex on 2016-10-15.
 */
var userUrlModel = require("../models/userUrlModel");
var likeModel = require("../models/likeModel");
var redis = require("redis");
var MetaInspector = require('node-metainspector');

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

var getFeed = function(pageSize, lastId, isPublic, userId, callback) {
    // console.log('lastId: ' + lastId);
    pageSize = parseInt(pageSize);
    var countQuery = {};
    var actualQuery = {};
    // console.log('userId: ' + userId);
    // console.log('lastId: ' + lastId);
    if (userId != -1) {
        countQuery['userId'] = userId;
        actualQuery['userId'] = userId;
    }
    if (lastId != -1) {
        actualQuery['_id'] = { $lt: lastId }
    }
    countQuery['public'] = isPublic;
    actualQuery['public'] = isPublic;

    userUrlModel.find( countQuery ).count(function(err, count){
        var json = { 'status': 'ok', 'count': count, 'data': [] };
        userUrlModel
            .find( actualQuery )
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
    });
};

var getMeta = function(url, callback) {
    url = decodeURIComponent(url);
    var client = new MetaInspector(url, { timeout: 5000 });

    var json = { 'result': { 'status': 'ok'}, 'meta': {} };

    client.on("fetch", function() {
        json['meta']['url'] = url;
        json['meta']['rootUrl'] = client.rootUrl;
        json['meta']['title'] = client.title;
        json['meta']['description'] = client.description;
        json['meta']['image'] = client.image;

        // console.log(client.images);
        var length = client.images.length;
        json['meta']['images'] = [];
        for (var i=0; i<length; i++) {
            json['meta']['images'].push(client.images[i]);
        }

        callback(json);
    });

    client.on("error", function(err) {
        console.log(err);
        json['result']['status'] = 'failed';
        json['result']['error'] = err;
        json['meta']['url'] = url;
        callback(json);
    });

    client.fetch();
};

var getPostById = function(postId, callback) {
    redisClient.get(postId, function(err, post) {
        if (post) {
            console.log("using cache: " + post);
            var json = JSON.parse(post);
            callback(json);
        } else {
            userUrlModel.findById(postId, function (err, postInDb) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(postInDb);
                console.log("stringify: " + JSON.stringify(postInDb));
                redisClient.set(postId, JSON.stringify(postInDb));
            });
        }
    });
};

var like = function(postId, userId, fullname, callback) {
    getPostById(postId, function(post) {
        var likePost = new likeModel({
            userId: userId,
            fullname: fullname,
            postId: postId,
            shortUrl: post.shortUrl
        });
        likePost.save(function() {
            callback({ 'status': 'ok', 'data': likePost });
        });

    });
};

var unlike = function(postId, userId, callback) {
    likeModel.find({ postId: postId, userId: userId }).remove(function() {
        callback({ 'status': 'ok' })
    });
};

var getNumberOfLikes = function(postId, callback) {
    var json = {'status': 'ok', 'data': {} };

    likeModel
        .find( {postId: postId} )
        .count()
        .exec(function(err, count){
            if (err) {
                json['status'] = 'failed';
                json['data'] = err;
                callback(json);
                return;
            }

            json['data']['count'] = count;
            callback(json);
        });
};

var hasLiked = function(postId, userId, callback) {
    var json = {'status': 'ok', 'data': {} };

    likeModel
        .find( {postId: postId, userId: userId} )
        .count()
        .exec(function(err, count){
            if (err) {
                json['status'] = 'failed';
                json['data'] = err;
                callback(json);
                return;
            }

            json['data']['hasLiked'] = count > 0;
            callback(json);
        });
};

module.exports = {
    add: add,
    getFeed: getFeed,
    getMeta: getMeta,
    like: like,
    unlike: unlike,
    getPostById: getPostById,
    getNumberOfLikes: getNumberOfLikes,
    hasLiked: hasLiked
};