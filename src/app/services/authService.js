/**
 * Created by dyorex on 2016-10-14.
 */
var userModel = require("../models/userModel");
var redis = require("redis");
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');

var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;

var redisClient = redis.createClient(port, host);

var createToken = function(user) {
    var payload = {
        exp: moment().add(14, 'days').unix(),
        iat: moment().unix(),
        sub: user._id
    };

    return jwt.encode(payload, config.tokenSecret);
};

var isAuthenticated = function(req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
        return res.status(400).send({ message: 'No Token.' });
    }

    var header = req.headers.authorization.split(' ');
    var token = header[1];
    var payload = jwt.decode(token, config.tokenSecret);
    var now = moment().unix();

    if (now > payload.exp) {
        return res.status(401).send({ message: 'Token has expired.' });
    }

    userModel.findById(payload.sub, function(err, user) {
        if (!user) {
            return res.status(400).send({ message: 'User does not exist.' });
        }

        req.user = user;
        next();
    })
};

var getUserId = function(req) {
    if (!(req.headers && req.headers.authorization)) {
        return '-1';
    }

    var header = req.headers.authorization.split(' ');
    var token = header[1];
    var payload = jwt.decode(token, config.tokenSecret);

    return payload.sub;
};

module.exports = {
    createToken: createToken,
    isAuthenticated: isAuthenticated,
    getUserId: getUserId
};