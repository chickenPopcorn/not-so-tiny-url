var assert = require('assert');
var http = require('http');
var server = require('../server');
var fs = require('fs');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');

var source = "";

try {
    console.log(__dirname);
    source = fs.readFileSync(__dirname + '/../public/views/index.html', 'utf8');
} catch (e) {
    console.error("error reading index.txt: " + e.message);
    return;
}

// unit test for server http response to 200 ok
describe('server request handling', function() {
    it('server http response should return 200', function (done) {
        http.get('http://localhost:3000', function (res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should be the same file as index.html', function (done) {
        http.get('http://localhost:3000', function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                assert.equal(source.toString(), data);
                done();
            });
        });
    });
});

describe('User', function() {
    var url = 'http://localhost:3000';
    /*before(function(done) {
        mongoose.connect("mongodb://user:user@ds049466.mlab.com:49466/tinyurl");
        done();
    });*/

    it('should return error trying to sign up with the same email', function(done) {
        var user = {
            email: 'dyorex@gmail.com',
            password: 'test',
            fullname: 'CY'
        };
        request(url)
            .post('/auth/reg')
            .send(user)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.property('status', 409);
                done();
            });
    });
    it('should return error trying to sign in with the wrong combination of username and password', function(done) {
        var user = {
            email: 'dyorex@gmail.com',
            password: 'test'
        };
        request(url)
            .post('/auth/login')
            .send(user)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.property('status', 401);
                done();
            });
    });
});

describe('Feed', function() {
    var url = 'http://localhost:3000';

    it('should return the most recent 2 public feed posts', function(done) {
        request(url)
            .get('/feed/public/2/-1')
            .send()
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.property('status', 200);
                done();
            });
    });
    it('should return the metadata for www.google.com', function(done) {
        request(url)
            .get('/feed/meta/www.google.com')
            .send()
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.property('status', 200);
                done();
            });
    });
    it('should return status 403 when trying to get the private feed without login', function(done) {
        request(url)
            .get('/feed/private/10/-1')
            .send()
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.property('status', 403);
                done();
            });
    });
    it('should return the number of likes for a certain post', function(done) {
        request(url)
            .get('/feed/post/likes/58030715c387a023e0fb1cb1')
            .send()
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.property('status', 200);
                done();
            });
    });
});