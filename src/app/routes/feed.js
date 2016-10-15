/**
 * Created by dyorex on 2016-10-14.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var userUrlService = require('../services/userUrlService');

router.get("/public/:pageSize/:lastId", function(req, res) {
    var pageSize = req.params.pageSize;
    var lastId = req.params.lastId;
    userUrlService.getFeed(pageSize, lastId, function(data) {
        res.json(data);
    });
});

module.exports = router;