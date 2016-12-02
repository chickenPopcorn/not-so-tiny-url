var assert = require('assert');
var http = require('http');
var server = require('../server');
var fs = require('fs');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var urlService = require('../services/urlService');

describe('URL', function() {
    var url = 'http://localhost:3000';

    it('should return a short URL for google.com', function(done) {
        urlService.getShortUrl('http://www.google.com', function(json) {
            // console.log(json);
            assert.equal(json.status, 'ok');
            done();
        });
    });
    it('should return status "failed" when trying to get a short URL for an invalid URL like "http://abcedfghijk"', function(done) {
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
    it('should return status "failed" when trying to get the long URL of a non-existed short URL', function(done) {
        urlService.getLongUrl('viueiwouoerjkj', function(json) {
            assert.equal(json.status, 'failed');
            done();
        });
    });
});



