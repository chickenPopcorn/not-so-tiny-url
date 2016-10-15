/**
 * Created by dyorex on 2016-10-15.
 */
angular.module('tinyurlApp')
    .factory('feedService', function($http) {
        return {
            getFeed: function(pageSize, lastId) {
                return $http.get('/feed/public/' + pageSize + '/' + lastId);
            },

            getMeta: function(url) {
                url = encodeURIComponent(url);
                return $http.get('/feed/meta/' + url);
            }
            // like: function(id) {
            //     return $http.post('/like', { photoId: id });
            // }
        }
    });