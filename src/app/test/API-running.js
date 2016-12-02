var assert = require('assert');
var http = require('http');
var server = require('../server');
var fs = require('fs');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');

describe('APIs', function () {
    var url = 'http://localhost:3000';

    describe('User', function () {
        it('should return error trying to sign up with the same email', function (done) {
            var user = {
                email: 'dyorex@gmail.com',
                password: 'test',
                fullname: 'CY'
            };
            request(url)
                .post('/auth/reg')
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 409);
                    done();
                });
        });
        it('should return error trying to sign in with the wrong combination of username and password', function (done) {
            var user = {
                email: 'dyorex@gmail.com',
                password: 'test'
            };
            request(url)
                .post('/auth/login')
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 401);
                    done();
                });
        });
    });

    describe('Feed', function () {
        it('should return the most recent 2 public feed posts', function (done) {
            request(url)
                .get('/feed/public/2/-1')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });
        it('should return the metadata for www.google.com', function (done) {
            request(url)
                .get('/feed/meta/www.google.com')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });
        it('should return status 403 when trying to get the private feed without login', function (done) {
            request(url)
                .get('/feed/private/10/-1')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 403);
                    done();
                });
        });
        it('should return the number of likes for a certain post', function (done) {
            request(url)
                .get('/feed/post/likes/58030715c387a023e0fb1cb1')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });
    });
    describe('Rank', function () {
        it('should return number of clicks for all urls', function (done) {
            request(url)
                .get('/rank/getAllClicks')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });
        it('should return top k urls with the highest number of clicks', function (done) {
            request(url)
                .get('/rank/getTopKUrls/10')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });
        it('should return the number of clicks for a given shortUrl', function (done) {
            request(url)
                .get('/rank/getUrlClicks/a')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });
        it('should get the number of clicks for shortUrls in MongoDB then save it in Redis', function (done) {
            request(url)
                .get('/rank/saveUrlClicks')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });
        it('should return the number of clicks for a given shortUrl in Redis', function (done) {
            request(url)
                .get('/rank/getUrlClicksCached/a')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });
        it('should update the number of clicks for a given shortUrl saved in Redis', function (done) {
            request(url)
                .get('/rank/updateUrlClicks/a')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

    });
});
