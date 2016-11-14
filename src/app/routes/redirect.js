var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var statsService = require('../services/statsService');
var path = require('path');

module.exports = function RedirectRouter(io) {
    var router = express.Router();
    router.get('*', function(req, res) {
        var shortUrl = req.originalUrl.slice(1);
        urlService.getLongUrl(shortUrl, function(url) {
            if (url) {
                res.redirect(url.longUrl);
                statsService.logRequest(shortUrl, req);
                io.emit('shortUrlVisited', shortUrl);
            } else {
                res.sendFile("404.html", {
                    root: path.join(__dirname, "../public/views")
                });
            }
        });
    });
    this.router = router;
};
