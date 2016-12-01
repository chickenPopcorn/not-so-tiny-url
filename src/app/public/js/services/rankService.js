angular.module('tinyurlApp')
    .factory('rankService', function($http) {
        return {
            saveUrlClicks: function() {
                return $http.get('/rank/saveUrlClicks/');
            },
            getAllClicks: function() {
                return $http.get('/rank/getAllClicks/');
            },
            getTopKUrls: function(k) {
                return $http.get('/rank/getTopKUrls/' + k);
            },
            getUrlClicks: function(shortUrl) {
                return $http.get('/rank/getClicks/' + shortUrl);
            }
        }
    });