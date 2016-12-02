var assert = require('assert');
var http = require('http');
var server = require('../server');
var fs = require('fs');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var statsService = require('../services/statsService');

describe('Stats', function() {
    var shortUrl = 'a';

    it('should return total number of clicks', function(done) {
        statsService.getUrlInfo(shortUrl, "totalClicks", function(count) {
            assert(count >= 4);
            done();
        });
    });
    it('should return clicks per hour', function(done) {
        statsService.getUrlInfo(shortUrl, "hour", function(data) {
            assert(data[0]._id.day >= 0);
            assert(data[0]._id.hour >= 0);
            assert(data[0]._id.minutes >= 0);
            assert(data[0]._id.month >= 0);
            assert(data[0]._id.year >= 2016);
            assert(data[0].count >= 0);
            assert(data[1]._id.day >= 0);
            assert(data[1]._id.hour >= 0);
            assert(data[1]._id.minutes >= 0);
            assert(data[1]._id.month >= 0);
            assert(data[1]._id.year >= 2016);
            assert(data[1].count >= 0);
            done();
        });
    });
    it('should return clicks per day', function(done) {
        statsService.getUrlInfo(shortUrl, "day", function(data) {
            assert(data[0]._id.day >= 0);
            assert(data[0]._id.hour >= 0);
            assert(data[0]._id.month >= 0);
            assert(data[0]._id.year >= 2016);
            assert(data[0].count >= 0);
            assert(data[1]._id.day >= 0);
            assert(data[1]._id.hour >= 0);
            assert(data[1]._id.month >= 0);
            assert(data[1]._id.year >= 2016);
            assert(data[1].count >= 0);
            done();
        });
    });
    it('should return clicks per month', function(done) {
        statsService.getUrlInfo(shortUrl, "month", function(data) {
            assert(data[0]._id.day >= 0);
            assert(data[0]._id.month >= 0);
            assert(data[0]._id.year >= 2016);
            assert(data[0].count >= 0);
            assert(data[1]._id.day >= 0);
            assert(data[1]._id.month >= 0);
            assert(data[1]._id.year >= 2016);
            assert(data[1].count >= 0);
            done();
        });
    });
    it('should return total number of clicks without defined request info type', function(done) {
        statsService.getUrlInfo(shortUrl, "test", function(res) {
            assert.strictEqual(res[0]._id, null);
            assert(res[0].count >= 4);
            done();
        });
    });

});