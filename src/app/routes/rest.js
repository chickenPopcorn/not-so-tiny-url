var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlService = require('../services/urlService');
var statsService = require('../services/statsService');
var authService = require('../services/authService');
var userUrlService = require('../services/userUrlService');

router.post('/urls', jsonParser, function(req, res) {
    var longUrl = req.body.longUrl;
    urlService.getShortUrl(longUrl, function(json) {
        if (json.status === 'ok') {
            authService.getUser(req, function(user) {
                // console.log('user: ' + user);
                if (user._id !== -1) {
                    var isPublic = typeof req.body.isPublic === 'undefined' ?
                        true : req.body.isPublic;
                    userUrlService.add(user._id, user.fullname, json.shortUrl,
                        longUrl, isPublic, function(data) {
                            // console.log(data);
                            var postId = data._id;
                            var userId = data.userId;
                            json['postId'] = postId;
                            json['userId'] = userId;

                            res.json(json);
                        });
                }
            });
        } else {
            res.status(400).send(json);
        }
    });
});

router.get('/urls/:shortUrl', function(req, res) {
    var shortUrl = req.params.shortUrl;
    urlService.getLongUrl(shortUrl, function(url) {
        res.json(url);
    });
});

router.get('/urls/:shortUrl/:info', function(req, res) {
    statsService.getUrlInfo(req.params.shortUrl, req.params.info,
        function(data) {
            res.json(data);
        });
});

module.exports = router;
