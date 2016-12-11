var assert = require('assert');
var http = require('http');
var server = require('../server');
var fs = require('fs');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var urlService = require('../services/urlService');
var authService = require('../services/authService');
var rest = require('../routes/rest.js');

describe('URL', function() {
    var url = 'http://localhost:3000';

    it('should return a short URL for google.com', function(done) {
        urlService.getShortUrl('http://www.google.com', function(json) {
            // console.log(json);
            assert.equal(json.status, 'ok');
            done();
        });
    });
    it('should return status "failed" when trying to get a short URL for an' +
        ' invalid URL like "http://abcedfghijk"',
        function(done) {
            this.timeout(0);
            urlService.getShortUrl('http://abcedfghijk', function(json) {
                assert.equal(json.status, 'failed');
                done();
            });
        });
    it('should return the long URL given a short URL', function(done) {
        urlService.getLongUrl('a', function(json) {
            assert.equal(json.status, 'ok');
            done();
        });
    });
    it('should return status "failed" when trying to get the long URL of a' +
        ' non-existed short URL',
        function(done) {
            urlService.getLongUrl('viueiwouoerjkj', function(json) {
                assert.equal(json.status, 'failed');
                done();
            });
        });

    // for rest.js
    it('should return 200 when get a specific url successfully', function(done) {
        request(url).get('/api/v1/urls/Ca').
        send().end(function(err, res) {
            if (err) {
                throw err;
            }
            res.should.have.property('status', 200);
            done();
        });
    });
    it('should return 200 when get url info successfully', function(done) {
        request(url).get('/api/v1/urls/Ca/hours').
        send().end(function(err, res) {
            if (err) {
                throw err;
            }
            res.should.have.property('status', 200);
            done();
        });
    });
    it('should return 200 when get urls successfully without logging in', function(done) {
        var url_para = {'longUrl': ''};
        request(url).post('/api/v1/urls')
            .send(url_para)
            .end(function(err, res) {
            if (err) {
                throw err;
            }
            // console.log(res.body);
            res.should.have.property('status', 400);
            done();
        });
    });

     it('should return 200 when get urls successfully after the user logging in', function(done) {
         var url_para = {'longUrl': 'http://www.lonelyplanet.com/news/2016/12/06/worlds-highest-bridge-proposal-daredevil/'};
         var user = {
             email: 'test@test.com',
             password: 'test123'
         };

         authService.login(user.email, user.password, function(json) {
             // assert.equal(json.status, 200);
             token = json.token;
             request(url).post('/api/v1/urls')
             .set('Authorization', 'Hello ' + token)
             .send(url_para)
             .end(function (err, res) {
                 if (err) {
                 throw err;
                 }
             // console.log(res.body);
                 res.should.have.property('status', 200);

                 var postId = res.body.postId;
                 var userId = res.body.userId;
                 request(url).post('/feed/post/removePost')
                     .set("Authorization", "Hello " + token)
                     .send({postId: postId, userId: userId})
                     .end(function(err, res) {
                         if (err) {
                             throw err;
                         }
                         assert.equal(res.body.status, 'ok');

                         done();
                     });
             });

         });
     });
    it('should return 403 if a user tries to delete a comment that does not belong to him/her', function(done) {
        var user = {
            email: 'test@test.com',
            password: 'test123'
        };

        authService.login(user.email, user.password, function(json) {
            // assert.equal(json.status, 200);
            token = json.token;
            var postId = '58030715c387a023e0fb1cb1';
            var userId = '5801670fec83023b1c9e81c1';
            request(url).post('/feed/post/removePost')
                .set("Authorization", "Hello " + token)
                .send({postId: postId, userId: userId})
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 403);
                    done();
                });

        });
    });

    // for redirect.js
    it('should return 200 when get a specific url successfully', function(done) {
        request(url).get('/urls/Ca').send().end(function (err, res) {
            if (err) {
                throw err;
            }
            res.should.have.property('status', 302);
            done();
        });
    });

});



