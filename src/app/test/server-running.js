var assert = require('assert');
var http = require('http');
var server = require('../server');
var fs = require('fs');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');


var urlService = require('../services/urlService');


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


