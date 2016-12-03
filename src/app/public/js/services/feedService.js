/**
 * Created by dyorex on 2016-10-15.
 */
angular.module('tinyurlApp').factory('feedService', function($http) {
    return {
        getFeed: function(pageSize, lastId) {
            return $http.get('/feed/public/' + pageSize + '/' + lastId);
        },

        getMeta: function(url) {
            url = encodeURIComponent(url);
            return $http.get('/feed/meta/' + url);
        },

        like: function(postId) {
            return $http.post('/feed/post/like', {postId: postId});
        },

        unlike: function(postId) {
            return $http.post('/feed/post/unlike', {postId: postId});
        },

        getNumberOfLikes: function(postId) {
            return $http.get('/feed/post/likes/' + postId);
        },

        hashLiked: function(postId) {
            return $http.get('/feed/post/liked/' + postId);
        },

        getPrivateFeed: function(pageSize, lastId) {
            return $http.get('/feed/private/' + pageSize + '/' + lastId);
        },

        getComments: function(postId) {
            return $http.get('/feed/post/comments/' + postId);
        },

        addComment: function(postId, message) {
            return $http.post('/feed/post/comment',
                {postId: postId, message: message});
        },

        removeComment: function(commentId) {
            return $http.post('/feed/post/removeComment',
                {commentId: commentId});
        },

        getNumberOfComments: function(postId) {
            return $http.get('/feed/post/numOfComments/' + postId);
        },

        removePost: function(postId) {
            return $http.post('/feed/post/removePost', {postId: postId});
        }
    };
});
