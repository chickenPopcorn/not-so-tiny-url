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
            },

            like: function(postId) {
                return $http.post('/feed/post/like', { postId: postId });
            },

            unlike: function(postId) {
                return $http.post('/feed/post/unlike', { postId: postId });
            },

            getNumberOfLikes: function(postId) {
                return $http.get('/feed/post/likes/' + postId);
            },

            hashLiked: function(postId) {
                return $http.get('/feed/post/liked/' + postId);
            }
        }
    });