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
            userUrlService.getFeed(pageSize, lastId, false, -1, function (data) {
                res.json(data);
            });
        } else {
            res.json({'message': 'No private feed'});
        }
    });
});

router.get("/meta/:url", function(req, res) {
    var url = req.params.url;
    userUrlService.getMeta(url, function(data) {
        res.json(data);
    });
});

module.exports = router;