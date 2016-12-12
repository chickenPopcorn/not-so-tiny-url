var assert = require('assert');
var http = require('http');
var server = require('../server');
var fs = require('fs');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var authService = require('../services/authService');
var jwt = require('jwt-simple');
var config = require('../services/config');


describe('APIs', function() {
    var url = 'http://localhost:3000';
    describe('Redis', function() {
        it('should return ok when flushing redis', function(done) {
            request(url).get('/rank/flushRedis').send().end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.property('status', 200);
                done();
            });
        });
    });

    describe('User', function() {
        it('should return error trying to sign up with the same email',
            function(done) {
                var user = {
                    email: 'dyorex@gmail.com',
                    password: 'test',
                    fullname: 'CY'
                };
                request(url).post('/auth/reg').send(user).
                    end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.property('status', 409);
                        done();
                    });
            });
        it('should return ok trying to sign up',
            function(done) {
                var user = {
                    email: 'test+' + Math.random() + '@gmail.com',
                    password: 'test',
                    fullname: 'CY'
                };
                request(url).post('/auth/reg').send(user).
                end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
            });
        it('should return error trying to sign in with the wrong combination ' +
            'of username and password',
            function(done) {
                var user = {
                    email: 'dyorex@gmail.com',
                    password: 'test'
                };
                request(url).post('/auth/login').send(user).
                    end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.property('status', 401);
                        done();
                    });
            });
        it('should return ok trying to sign in with the correct combination ' +
            'of username and password',
            function(done) {
                var user = {
                    email: 'test@test.com',
                    password: 'test123'
                };
                request(url).post('/auth/login').send(user).
                end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
            });
    });

    describe('Feed', function() {
        it('should return the most recent 2 public feed posts',
            function(done) {
                request(url).get('/feed/public/2/-1').send().
                    end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.property('status', 200);
                        done();
                    });
            });
        it('should return the metadata for www.google.com', function(done) {
            request(url).get('/feed/meta/www.google.com').send().
                end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });
        it('should return status 403 when trying to get the private feed' +
            ' without login',
            function(done) {
                request(url).get('/feed/private/10/-1').send().
                    end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.property('status', 403);
                        done();
                    });
            });
        it('should return 200 when trying to get the private feed with login',
            function(done) {
                var user = {
                    email: 'test@test.com',
                    password: 'test123'
                };
                authService.login(user.email, user.password, function(json) {
                    // assert.equal(json.status, 200);
                    token = json.token;
                    request(url).get('/feed/private/10/-1')
                        .set('Authorization', 'Hello ' + token)
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
        it('should return the number of likes for a certain post',
            function(done) {
                request(url).get('/feed/post/likes/58030715c387a023e0fb1cb1').
                    send().end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
            });
        it('should return the number of post that gets posted',
            function(done) {
                request(url).get('/feed/post/58030715c387a023e0fb1cb1').send().
                end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
            });
        it('should return 403 if checking a post has been liked by ' +
            'a non-logged-in user',
            function(done) {
                request(url).get('/feed/post/liked/58030715c387a023e0fb1cb1')
                    .send()
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.property('status', 403);
                        done();
                    });
            });
        it('should return 200 if checking a post has been liked by ' +
            'a logged-in user',
            function(done) {
                var user = {
                        email: 'test@test.com',
                        password: 'test123'
                };
                authService.login(user.email, user.password, function(json) {
                    // assert.equal(json.status, 200);
                    token = json.token;
                    request(url).get('/feed/post/liked' +
                        '/58030715c387a023e0fb1cb1')
                        .set('Authorization', 'Hello ' + token)
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
        it('should return 403 if an unlogged-in user likes a certain post',
            function(done) {
                request(url).post('/feed/post/like')
                    .field('postId', '58030715c387a023e0fb1cb1')
                    .send()
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.property('status', 403);
                        done();
                    });
            });
        it('should return 200 if a logged-in user likes a post',
            function(done) {
                var user = {
                    email: 'test@test.com',
                    password: 'test123'
                };
                authService.login(user.email, user.password, function(json) {
                    // assert.equal(json.status, 200);
                    token = json.token;
                    request(url).post('/feed/post/like')
                        .set('Authorization', 'Hello ' + token)
                        .send({postId: '58030715c387a023e0fb1cb1'})
                        .end(function(err, res) {
                            if (err) {
                                throw err;
                            }
                            assert.equal(res.body.status, 'ok');
                            done();
                        });
                });
            });
        it('should return 403 if an unlogged-in user unlikes a certain post',
            function(done) {
                request(url).post('/feed/post/unlike').send().
                end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 403);
                    done();
                });
            });
        it('should return 200 if a logged-in user unlikes a post',
            function(done) {
                var user = {
                    email: 'test@test.com',
                    password: 'test123'
                };
                authService.login(user.email, user.password, function(json) {
                    // assert.equal(json.status, 200);
                    token = json.token;
                    request(url).post('/feed/post/unlike')
                        .set('Authorization', 'Hello ' + token)
                        .send({postId: '58030715c387a023e0fb1cb1'})
                        .end(function(err, res) {
                            if (err) {
                                throw err;
                            }
                            assert.equal(res.body.status, 'ok');
                            done();
                        });
                });
            });
        it('should return 403 if an unlogged-in user adds comment on a post',
            function(done) {
                request(url).post('/feed/post/comment').send().
                end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 403);
                    done();
                });
            });
        it('should return 200 if a logged-in user adds and removes a comment on a post',
            function(done) {
                var user = {
                    email: 'test@test.com',
                    password: 'test123'
                };
                authService.login(user.email, user.password, function(json) {
                    // assert.equal(json.status, 200);
                    token = json.token;
                    request(url).post('/feed/post/comment')
                        .set('Authorization', 'Hello ' + token)
                        .send({postId: '58030715c387a023e0fb1cb1'})
                        .end(function(err, res) {
                            if (err) {
                                throw err;
                            }
                            assert.equal(res.body.status, 'ok');

                            // from here it is the removal part
                            var commentId = res.body.data._id;
                            var userId = res.body.data.userId;
                            request(url).post('/feed/post/removeComment')
                                .set("Authorization", "Hello " + token)
                                .send({commentId: commentId, userId: userId})
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
        it('should return 403 if a user tries to delete a comment that does not belong to him/her',
            function(done) {
                var user = {
                    email: 'test@test.com',
                    password: 'test123'
                };
                authService.login(user.email, user.password, function(json) {
                    // assert.equal(json.status, 200);
                    token = json.token;
                    var commentId = '5844e073bd057d3e37346952';
                    var userId = '5801670fec83023b1c9e81c1';
                    request(url).post('/feed/post/removeComment')
                        .set("Authorization", "Hello " + token)
                        .send({commentId: commentId, userId: userId})
                        .end(function(err, res) {
                            if (err) {
                                throw err;
                            }


                            res.should.have.property('status', 403);
                            done();
                        });
                });
            });
        // remove comment = 58016eea901fbc0001a3b99a
        it('should return 403 if an unlogged-in user adds comment on a post',
            function(done) {
                request(url).post('/feed/post/removeComment').send().
                end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 403);
                    done();
                });
            });

        // get comments for a post
        it('should return ok status if gets comment for a certain ' +
            'post successfully',
            function(done) {
                request(url).get('/feed/post/comments' +
                    '/58030715c387a023e0fb1cb1').
                send().end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    assert.equal(res.body.status, 'ok');
                    done();
                });
            });
        it('should return ok status if gets the number of comment ' +
            'for a certain post successfully',
            function(done) {
                request(url).get('/feed/post/numOfComments' +
                    '/58030715c387a023e0fb1cb1').
                send().end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    assert.equal(res.body.status, 'ok');
                    done();
                });
            });

        it('should return 403 if an unlogged-in user tries to remove a post',
            function(done) {
                request(url).post('/feed/post/removePost').send().
                end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 403);
                    done();
                });
            });
    });

    describe('Rank', function() {
        it('should return number of clicks for all urls', function(done) {
            request(url).get('/rank/getAllClicks').send().
                end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });
        it('should return top k urls with the highest number of clicks',
            function(done) {
                request(url).get('/rank/getTopKUrls/10').send().
                    end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.property('status', 200);
                        done();
                    });
            });
        it('should return the number of clicks for a given shortUrl',
            function(done) {
                request(url).get('/rank/getUrlClicks/a').send().
                    end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.property('status', 200);
                        done();
                    });
            });
        it('should get the number of clicks for shortUrls in MongoDB then' +
            ' save it in Redis',
            function(done) {
                request(url).get('/rank/saveUrlClicks').send().
                    end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.property('status', 200);
                        done();
                    });
            });
        it('should return the number of clicks for a given shortUrl in Redis',
            function(done) {
                request(url).get('/rank/getUrlClicksCached/a').send().
                    end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.property('status', 200);
                        done();
                    });
            });
        it('should update the number of clicks for a given shortUrl saved in' +
            ' Redis',
            function(done) {
                request(url).get('/rank/updateUrlClicks/a').send().
                    end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.property('status', 200);
                        done();
                    });
            });

    });
});
