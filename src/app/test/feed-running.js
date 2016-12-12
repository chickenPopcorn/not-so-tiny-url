var assert = require('assert');
var http = require('http');
var server = require('../server');
var fs = require('fs');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var userUrlService = require('../services/userUrlService');
var authService = require('../services/authService');
var userUrlModel = require('../models/userUrlModel');


describe('Feed', function() {
    var url = 'http://localhost:3000';

    it('should return the most recent 2 public feed posts', function(done) {
        userUrlService.getFeed(2, '-1', true, -1, function(json) {
            assert.equal(json.data.length, 2);
            done();
        });
    });
    it('should return the most recent 2 public feed posts (with a lastId)', function(done) {
        userUrlService.getFeed(2, '58030715c387a023e0fb1cb1', true, -1, function(json) {
            assert.equal(json.data.length, 2);
            done();
        });
    });
    it('should return the metadata for www.google.com', function(done) {
        userUrlService.getMeta('http://www.google.com', function(json) {
            assert.equal(json.result.status, 'ok');
            done();
        });
    });
    it('should return the error message for an invalid URL when getting metadata', function(done) {
        this.timeout(0);
        userUrlService.getMeta('http://wwwwwwwww', function(json) {
            assert.equal(json.result.status, 'failed');
            done();
        });
    });
    it('should return status ok when getting the private feed for a user',
        function(done) {
            userUrlService.getFeed(10, '-1', false, '5801670fec83023b1c9e81c1',
                function(json) {
                    assert.equal(json.status, 'ok');
                    done();
                });
        });
    it('should return the number of likes for a certain post', function(done) {
        userUrlService.getNumberOfLikes('58030715c387a023e0fb1cb1',
            function(json) {
                assert.equal(json.status, 'ok');
                done();
            });
    });
    it('should successfully like a post', function(done) {
        userUrlService.getNumberOfLikes('58030715c387a023e0fb1cb1',
            function(json) {
                var count = json.data.count;
                userUrlService.like('58030715c387a023e0fb1cb1',
                    '58214149f193d82e0032087b', 'For Test', function() {
                        userUrlService.getNumberOfLikes(
                            '58030715c387a023e0fb1cb1', function(json1) {
                                var count1 = json1.data.count;
                                assert.equal(count1, count + 1);
                                done();
                            });
                    });
            });
    });
    it('should successfully unlike a post', function(done) {
        userUrlService.getNumberOfLikes('58030715c387a023e0fb1cb1',
            function(json) {
                var count = json.data.count;
                userUrlService.unlike('58030715c387a023e0fb1cb1',
                    '58214149f193d82e0032087b', function() {
                        userUrlService.getNumberOfLikes(
                            '58030715c387a023e0fb1cb1', function(json1) {
                                var count1 = json1.data.count;
                                assert.equal(count1, count - 1);
                                done();
                            });
                    });
            });
    });
    it('should return the correct comment from post', function(done) {
        userUrlService.getNumberOfLikes('58030715c387a023e0fb1cb1',
            function(json) {
                assert.equal(json.status, 'ok');
                done();
            });
    });
    // added
    it('should return the correct post from id', function(done) {
        userUrlService.getPostById('58030715c387a023e0fb1cb1', function(json) {
            assert.equal(json.shortUrl, 'V');
            done();
        });
    });
    it('should return user did not like post', function(done) {
        userUrlService.hasLiked('58030715c387a023e0fb1cb1',
            '58214149f193d82e0032087b', function(json) {
                assert.equal(json.status, 'ok');
                assert.equal(json.data.hasLiked, false);
                done();
            });
    });
    it('should return user liked post', function(done) {
        userUrlService.hasLiked('5802cf4338e1ca386403687b',
            '58016eea901fbc0001a3b99a', function(json) {
                assert.equal(json.status, 'ok');
                assert.equal(json.data.hasLiked, true);
                done();
            });
    });
    var commentId = '';
    it('should add comment to post', function(done) {
        userUrlService.addComment('5802cf4338e1ca386403687b',
            '58016eea901fbc0001a3b99a', 'Ruicong Xie', 'testing',
            function(json) {
                assert.equal(json.status, 'ok');
                assert.equal(json.data.message, 'testing');
                assert.equal(json.data.fullname, 'Ruicong Xie');
                commentId = json.data._id;
                done();
            });
    });
    it('should fail to add comment with a non-logged-in user', function(done) {
        userUrlService.addComment('5802cf4338e1ca386403687b',
            -1, 'Ruicong Xie', 'testing',
            function(json) {
                assert.equal(json.status, 'failed');
                done();
            });
    });
    it('should fail to remove comment', function(done) {
        userUrlService.removeComment(commentId, -1, function(json) {
            assert.equal(json.status, 'failed');
            assert.equal(json.message, 'Not logged in.');
            done();
        });
    });
    it('should remove comment after login', function(done) {
        userUrlService.removeComment(commentId, '58016eea901fbc0001a3b99a',
            function(json) {
                assert.equal(json.status, 'ok');
                done();
            });
    });

    it('should return empty comment array from post', function(done) {
        userUrlService.getComments('5802cf4338e1ca386403687b', function(json) {
            assert.equal(json.status, 'ok');
            assert.equal(json.data.toString(), '');
            done();
        });
    });
    it('should return comments from post', function(done) {
        userUrlService.getComments('582d1b63eca28c08bf61ed1d', function(json) {
            assert.equal(json.status, 'ok');
            assert.equal(json.data[0].message, 'Thank you for sharing this.');
            assert.equal(json.data[1].message, 'Oh great :)');
            done();
        });
    });

    it('should return number of comments from post', function(done) {
        userUrlService.getNumberOfComments('582d1b63eca28c08bf61ed1d',
            function(json) {
                assert.equal(json.status, 'ok');
                assert.equal(json.data.count, 3);
                done();
            });
    });

    it('should return number of comments from post', function(done) {
        userUrlService.getNumberOfComments('582d1b63eca28c08bf61ed1d',
            function(json) {
                assert.equal(json.status, 'ok');
                assert.equal(json.data.count, 3);
                done();
            });
    });
    var postId = '';
    it('should add post for user and delete fail for not logged in and delete',
        function(done) {
            userUrlService.add('58016eea901fbc0001a3b99a', 'Ruicong Xie',
                'test', 'https://www.test.com/', true, function(json) {
                    assert.equal(json.userId, '58016eea901fbc0001a3b99a');
                    assert.equal(json.fullname, 'Ruicong Xie');
                    assert.equal(json.shortUrl, 'test');
                    assert.equal(json.longUrl, 'https://www.test.com/');
                    postId = json._id;
                    userUrlService.removePost(postId, -1, function(json) {
                        assert.equal(json.status, 'failed');
                        assert.equal(json.message, 'Not logged in.');
                        userUrlService.removePost(postId,
                            '58016eea901fbc0001a3b99a', function(json) {
                                assert.equal(json.status, 'ok');
                                userUrlModel.findByIdAndRemove(postId,
                                    function(err, postInDb) {
                                        if (err) throw err;
                                    });
                                done();
                            });
                    });

                });
        });
    it('should return error message when a non-logged-in user tries to add a new post',
        function(done) {
            userUrlService.add(-1, 'Ruicong Xie',
                'test', 'https://www.test.com/', true, function(json) {
                    assert.equal(json.message, 'No userId.');
                    done();
                    });
        });
});


