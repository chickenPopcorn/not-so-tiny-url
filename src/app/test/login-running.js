var assert = require('assert');
var http = require('http');
var server = require('../server');
var fs = require('fs');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var authService = require('../services/authService');

describe('User', function() {
    var url = 'http://localhost:3000';
    it('should return error trying to sign up with the same email',
        function(done) {
            var user = {
                email: 'dyorex@gmail.com',
                password: 'test',
                fullname: 'CY'
            };

            authService.reg(user.email, user.password, user.fullname,
                function(json) {
                    assert.equal(json.status, 409);
                    done();
                });
        });
    it('should return error trying to sign in with the wrong combination of' +
        ' username and password',
        function(done) {
            var user = {
                email: 'dyorex@gmail.com',
                password: 'test'
            };

            authService.login(user.email, user.password, function(json) {
                assert.equal(json.status, 401);
                done();
            });
        });
    it('should return status 200 if trying to sign in with the correct' +
        ' combination of username and password',
        function(done) {
            var user = {
                email: 'test@test.com',
                password: 'test123'
            };

            authService.login(user.email, user.password, function(json) {
                assert.equal(json.status, 200);
                done();
            });
        });
});
