/**
 * Created by dyorex on 2016-10-14.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var userUrlService = require('../services/userUrlService');
var authService = require('../services/authService');

router.get("/public/:pageSize/:lastId", function(req, res) {
    var pageSize = req.params.pageSize;
    var lastId = req.params.lastId;
    userUrlService.getFeed(pageSize, lastId, true, -1, function(data) {
        res.json(data);
    });
});

router.get("/private/:pageSize/:lastId", function(req, res) {
    var pageSize = req.params.pageSize;
    var lastId = req.params.lastId;
    authService.getUser(req, function(user) {
        if (user._id != -1) {
            userUrlService.getFeed(pageSize, lastId, false, user._id, function (data) {
                res.json(data);
            });
        } else {
            res.status(403).json({'message': 'No private feed'});
        }
    });
});

router.get("/meta/:url", function(req, res) {
    var url = req.params.url;
    userUrlService.getMeta(url, function(data) {
        res.json(data);
    });
});

router.get("/post/:id", function(req, res) {
    var postId = req.params.id;
    userUrlService.getPostById(postId, function(data) {
        res.json(data);
    });
});

router.get("/post/likes/:id", function(req, res) {
    var postId = req.params.id;
    userUrlService.getNumberOfLikes(postId, function(data) {
        res.json(data);
    });
});

router.get("/post/liked/:id", function(req, res) {
    var postId = req.params.id;
    authService.getUser(req, function(user) {
        var userId = user._id;
        if (userId != -1) {
            userUrlService.hasLiked(postId, userId, function (data) {
                res.json(data);
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
        }
    });
});

router.post("/post/like", jsonParser, function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        var fullname = user.fullname;
        if (userId != -1) {
            userUrlService.like(req.body.postId, userId, fullname, function (data) {
                res.json(data);
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
        }
    });
});

router.post("/post/unlike", jsonParser, function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        if (userId != -1) {
            userUrlService.unlike(req.body.postId, userId, function (data) {
                res.json(data);
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
        }
    });
});

// add comment
router.post("/post/comment", jsonParser, function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        var fullname = user.fullname;
        if (userId != -1) {
            userUrlService.addComment(req.body.postId, userId, fullname, req.body.message, function (data) {
                res.json(data);
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not authorized.'});
        }
    });
});

// remove comment
router.post("/post/removeComment", jsonParser, function(req, res) {
    authService.getUser(req, function(user) {
        var userId = user._id;
        if (userId != -1) {
            userUrlService.removeComment(req.body.commentId, userId, function (data) {
                if (data.status == 'ok') {
                    res.json(data);
                } else {
                    res.status(403).send(data);
                }
            });
        } else {
            res.status(403).send({'status': 'failed', 'message': 'Not logged in.'});
        }
    });
});

// get comments for a post
router.get("/post/comments/:id", function(req, res) {
    var postId = req.params.id;
    userUrlService.getComments(postId, function(data) {
        res.json(data);
    });
});

module.exports = router;