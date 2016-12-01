var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var rankUrlService = require('../services/rankUrlService');

router.get("/saveUrlClicks", function(req, res) {
    rankUrlService.saveUrlClicks(function(err, data) {
        if (err != null) {
            res.status(403).json({'message': 'Save all Urls\' click information to Redis failed'});
            return;
        }
        res.json({'message': 'Success'});
    });
});

router.get("/getAllClicks", function(req, res) {
    rankUrlService.getAllClicks(function(err, data) {
        res.json({ err: err, data: data});
    });
});

router.get("/getTopKUrls/:k", function(req, res) {
    rankUrlService.getTopKUrls(req.params.k, function(data) {
        res.json(data);
    });
});

router.get("/getUrlClicks/:shortUrl", function(req, res) {
    rankUrlService.getUrlClicks(req.params.shortUrl, function(shortUrl, data) {
        res.json({ shortUrl: shortUrl, clicks: data });
    });
});

router.get("/getUrlClicksCached/:shortUrl", function(req, res) {
    rankUrlService.getUrlClicksCached(req.params.shortUrl, function(shortUrl, data) {
        res.json({ shortUrl: shortUrl, clicks: data });
    });
});

router.get("/updateUrlClicks/:shortUrl", function(req, res) {
    rankUrlService.updateUrlClicks(req.params.shortUrl, function(shortUrl, data) {
        res.json({shortUrl: shortUrl, clicks: data});
    });
});

module.exports = router;