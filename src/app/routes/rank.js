var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var rankUrlService = require('../services/rankUrlService');

router.get("/saveUrlClicks", function(req, res) {
    rankUrlService.saveUrlClicks(function(err) {
        res.json(err);
    });
});

router.get("/getAllClicks", function(req, res) {
    rankUrlService.getAllClicks(function(err, data) {
        res.json(err);
    });
});

router.get("/getTopKUrls/:k", function(req, res) {
    rankUrlService.getTopKUrls(req.params.k, function(data) {
        res.json(data);
    });
});

router.get("/getClicks/:shortUrl", function(req, res) {
    rankUrlService.getUrlClicks(req.params.shortUrl, function(data) {
        res.json(data);
    });
});


module.exports = router;