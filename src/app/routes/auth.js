/**
 * Created by dyorex on 2016-10-14.
 */
var express = require('express');
var router = express.Router();
var userModel = require("../models/userModel");
var authService = require("../services/authService");
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.post('/login', jsonParser, function(req, res) {
    userModel.findOne({ email: req.body.email }, '+password', function(err, user) {
        if (!user) {
            return res.status(401).send({ message: { email: 'This user does not exist.' } });
        }

        bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ message: { password: 'The password is not correct.' } });
            }

            user = user.toObject();
            delete user.password;

            var token = authService.createToken(user);
            res.send({ token: token, user: user });
        });
    });
});

router.post('/reg', jsonParser, function(req, res) {
    // console.log(req.body);
    userModel.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            return res.status(409).send({ message: { email: 'Email is already taken.' } });
        }

        var user = new userModel({
            email: req.body.email,
            password: req.body.password,
            fullname: req.body.fullname
        });

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;

                user.save(function() {
                    var token = authService.createToken(user);
                    res.send({ token: token, user: user });
                });
            });
        });
    });
});

router.get('/test', function(req, res) {
    return res.status(200).send({ message: 'yoyoyoyoyoyoyoy' });
});

module.exports = router;
