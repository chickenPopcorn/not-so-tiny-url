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

    it('should return the most recent 2 public feed posts', function (done) {
        userUrlService.getFeed(2, -1, true, -1, function (json) {
            assert.equal(json.data.length, 2);
            done();
        });
    });
    it('should return the metadata for www.google.com', function (done) {
        userUrlService.getMeta("http://www.google.com", function (json) {
            assert.equal(json.result.status, 'ok');
            done();
        });
    });
    it('should return status ok when getting the private feed for a user', function (done) {
        userUrlService.getFeed(10, -1, false, '5801670fec83023b1c9e81c1', function (json) {
            assert.equal(json.status, 'ok');
            done();
        });
    });
    it('should return the number of likes for a certain post', function (done) {
        userUrlService.getNumberOfLikes('58030715c387a023e0fb1cb1', function (json) {
            assert.equal(json.status, 'ok');
            done();
        });
    });
    it('should successfully like a post', function (done) {
        userUrlService.getNumberOfLikes('58030715c387a023e0fb1cb1', function (json) {
            var count = json.data.count;
            userUrlService.like('58030715c387a023e0fb1cb1', '58214149f193d82e0032087b', 'For Test', function () {
                userUrlService.getNumberOfLikes('58030715c387a023e0fb1cb1', function (json1) {
                    var count1 = json1.data.count;
                    // console.log('count:' + count);
                    // console.log('count1:' + count1);
                    assert.equal(count1, count + 1);
                    done();
                });
            });
        });
    });
    it('should successfully unlike a post', function (done) {
        userUrlService.getNumberOfLikes('58030715c387a023e0fb1cb1', function (json) {
            var count = json.data.count;
            userUrlService.unlike('58030715c387a023e0fb1cb1', '58214149f193d82e0032087b', function () {
                userUrlService.getNumberOfLikes('58030715c387a023e0fb1cb1', function (json1) {
                    var count1 = json1.data.count;
                    // console.log('count:' + count);
                    // console.log('count1:' + count1);
                    assert.equal(count1, count - 1);
                    done();
                });
            });
        });
    });
});

describe('URL', function() {
    var url = 'http://localhost:3000';

    it('should return a short URL for google.com', function(done) {
        urlService.getShortUrl("http://www.google.com", function(json) {
            assert.equal(json.status, 'ok');
            done();
        });
    });
    it('should return the long URL given a short URL', function(done) {
        urlService.getLongUrl("a", function(json) {
            assert.equal(json.status, 'ok');
            done();
        });
    });
});