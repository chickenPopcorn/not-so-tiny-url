var longToShortHash = {};
var shortToLongHash = {};

var getShortUrl = function(longUrl) {
    if (longToShortHash[longUrl] != null) {
        return longToShortHash[longUrl];
    } else {
        var shortUrl = generateShortUrl();
        longToShortHash[longUrl] = shortUrl;
        shortToLongHash[shortUrl] = longUrl;
        return shortUrl;
    }
};

var getLongUrl = function(shortUrl) {
    return shortToLongHash[shortUrl];
};

var generateShortUrl = function() {
    var id = Object.keys(longToShortHash).length + 1;
    var code = "abcdefghijklmnopqrstuvwxzy";
    code += code.toUpperCase();
    code += '0123456789';
    var shortUrl = "";
    while (id > 0) {
        shortUrl += code[(id - 1) % 62];
        id = parseInt(id / 62);
    }
    return shortUrl;
};

module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl
};
