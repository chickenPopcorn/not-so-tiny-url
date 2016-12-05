/**
 * Created by dyorex on 2016-10-15.
 */
var userUrlModel = require('../models/userUrlModel');
var likeModel = require('../models/likeModel');
var commentModel = require('../models/commentModel');
var redis = require('redis');
var MetaInspector = require('node-metainspector');

var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;

var redisClient = redis.createClient(port, host);

var add = function(userId, fullname, shortUrl, longUrl, isPublic, callback) {
    if (userId !== -1) {
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
        callback({message: 'No userId.'});
    }
};

var getFeed = function(pageSize, lastId, isPublic, userId, callback) {
    // console.log('lastId: ' + lastId);
    pageSize = parseInt(pageSize);
    var countQuery = {isDeleted: {$ne: true}};
    var actualQuery = {isDeleted: {$ne: true}};
    // console.log('userId: ' + userId);
    // console.log('lastId: ' + lastId);
    if (userId !== -1) {
        countQuery['userId'] = userId;
        actualQuery['userId'] = userId;
    }
    if (lastId !== '-1') {
        actualQuery['_id'] = {$lt: lastId};
    }
    countQuery['public'] = isPublic;
    actualQuery['public'] = isPublic;

    userUrlModel.find(countQuery).count(function(err, count) {
        var json = {'status': 'ok', 'count': count, 'data': []};
        userUrlModel.find(actualQuery).sort({'_id': -1}).limit(pageSize).
            exec(function(err, data) {
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
    var client = new MetaInspector(url, {timeout: 5000});

    var json = {'result': {'status': 'ok'}, 'meta': {}};

    client.on('fetch', function() {
        json['meta']['url'] = url;
        json['meta']['rootUrl'] = client.rootUrl;
        json['meta']['title'] = client.title;
        json['meta']['description'] = client.description;
        json['meta']['image'] = client.image;

        // console.log(client.images);
        var length = client.images.length;
        json['meta']['images'] = [];
        for (var i = 0; i < length; i++) {
            json['meta']['images'].push(client.images[i]);
        }

        callback(json);
    });

    client.on('error', function(err) {
        console.log(err);
        json['result']['status'] = 'failed';
        json['result']['error'] = err;
        json['meta']['url'] = url;
        callback(json);
    });

    client.fetch();
};

var getPostById = function(postId, callback) {
    redisClient.get(postId.toString(), function(err, post) {
        if (post) {
            // console.log("using cache: " + post);
            var json = JSON.parse(post);
            callback(json);
        } else {
            userUrlModel.findById(postId, function(err, postInDb) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(postInDb);
                // console.log("stringify: " + JSON.stringify(postInDb));
                redisClient.set(postId.toString(), JSON.stringify(postInDb));
            });
        }
    });
};

var removePost = function(postId, userId, callback) {
    if (userId === -1) {
        callback({'status': 'failed', 'message': 'Not logged in.'});
    } else {
        getPostById(postId, function(post) {
            if (userId != post.userId) {
                callback({'status': 'failed', 'message': 'Not authorized.'});
            } else {
                userUrlModel.update({_id: postId}, {
                    isDeleted: true
                }, function(err, affected, resp) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    redisClient.del(postId.toString());
                    callback({'status': 'ok'});
                });
            }
        });
    }
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
            callback({'status': 'ok', 'data': likePost});
        });

    });
};

var unlike = function(postId, userId, callback) {
    likeModel.find({postId: postId, userId: userId}).remove(function() {
        callback({'status': 'ok'});
    });
};

var getNumberOfLikes = function(postId, callback) {
    var json = {'status': 'ok', 'data': {}};

    likeModel.find({postId: postId}).count().exec(function(err, count) {
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
    var json = {'status': 'ok', 'data': {}};

    likeModel.find({postId: postId, userId: userId}).count().
        exec(function(err, count) {
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

var addComment = function(postId, userId, fullname, message, callback) {
    if (userId == -1) {
        callback({'status': 'failed', 'message': 'Not authorized.'});
    } else {
        getPostById(postId, function(post) {
            var comment = new commentModel({
                userId: userId,
                fullname: fullname,
                postId: postId,
                shortUrl: post.shortUrl,
                message: message,
                isDeleted: false,
                timestamp: Date.now()
            });
            comment.save(function() {
                callback({'status': 'ok', 'data': comment});
            });

        });
    }
};

var getCommentById = function(commentId, callback) {
    redisClient.get(commentId.toString(), function(err, comment) {
        if (comment) {
            // console.log("using cache: " + post);
            var json = JSON.parse(comment);
            callback(json);
        } else {
            commentModel.findById(commentId, function(err, commentInDb) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(commentInDb);
                // console.log("stringify: " + JSON.stringify(postInDb));
                redisClient.set(commentId.toString(),
                    JSON.stringify(commentInDb));
            });
        }
    });
};

var removeComment = function(commentId, userId, callback) {
    if (userId == -1) {
        callback({'status': 'failed', 'message': 'Not logged in.'});
    } else {
        getCommentById(commentId.toString(), function(comment) {
            if (userId != comment.userId) {
                callback({'status': 'failed', 'message': 'Not authorized.'});
            } else {
                commentModel.update({_id: commentId}, {
                    isDeleted: true
                }, function(err, affected, resp) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    redisClient.del(commentId.toString());
                    callback({'status': 'ok'});
                });
            }
        });
    }
};

var getComments = function(postId, callback) {
    var json = {'status': 'ok', 'data': {}};

    commentModel.find({postId: postId, isDeleted: {$ne: true}}).sort({_id: 1}).
        exec(function(err, comments) {
            if (err) {
                json['status'] = 'failed';
                json['data'] = err;
                callback(json);
                return;
            }

            json['data'] = comments;
            callback(json);
        });
};

var getNumberOfComments = function(postId, callback) {
    var json = {'status': 'ok', 'data': {}};

    commentModel.find({postId: postId, isDeleted: {$ne: true}}).count().
        exec(function(err, count) {
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

module.exports = {
    add: add,
    getFeed: getFeed,
    getMeta: getMeta,
    like: like,
    unlike: unlike,
    getPostById: getPostById,
    getNumberOfLikes: getNumberOfLikes,
    hasLiked: hasLiked,
    addComment: addComment,
    removeComment: removeComment,
    getComments: getComments,
    getNumberOfComments: getNumberOfComments,
    removePost: removePost
};
