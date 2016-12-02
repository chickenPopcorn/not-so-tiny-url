var assert = require('assert');
var http = require('http');
var server = require('../server');
var fs = require('fs');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var rankUrlService = require('../services/rankUrlService');
describe('Rank', function() {
    var url = 'http://localhost:3000';

    it('should return number of clicks for all urls', function (done) {
        rankUrlService.getAllClicks(function (err, data) {
            assert.equal(err, null);
            done();
        });
    });
    it('should return top k urls with the highest number of clicks', function (done) {
        var k = 10;
        rankUrlService.getTopKUrls(k, function(data) {
            assert(data != null);
            done();
        });
    });
    it('should return the number of clicks for a given shortUrl', function (done) {
        var tinyUrl = 'a';
        rankUrlService.getUrlClicks(tinyUrl, function(shortUrl, data) {
            assert.equal(shortUrl, tinyUrl);
            assert(data >= 0);
            done();
        });
    });
    it('should get the number of clicks for shortUrls in MongoDB then save it in Redis', function (done) {
        rankUrlService.saveUrlClicks(function(err) {
            assert.equal(err, null);
            done();
        });
    });
    it('should return the number of clicks for a given shortUrl saved in Redis', function (done) {
        var tinyUrl = 'a';
        rankUrlService.getUrlClicksCached(tinyUrl, function(shortUrl, data) {
            assert.equal(shortUrl, tinyUrl);
            assert(data >= 0);
            done();
        });
    });
    it('should update the number of clicks for a given shortUrl saved in Redis', function (done) {
        var tinyUrl = 'a';
        rankUrlService.getUrlClicks(tinyUrl, function(shortUrl, data) {
            var prev = shortUrl;
            rankUrlService.updateUrlClicks(shortUrl, function(shortUrl, data) {
                assert.equal(prev, shortUrl);
                done();
            });
        });
    });

});
