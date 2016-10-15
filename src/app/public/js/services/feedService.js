/**
 * Created by dyorex on 2016-10-15.
 */
angular.module('tinyurlApp')
    .factory('feedService', function($http) {
        return {
            getFeed: function(pageSize, lastId) {
                return $http.get('/feed/public/' + pageSize + '/' + lastId);
            }
            // like: function(id) {
            //     return $http.post('/like', { photoId: id });
            // }
        }
    });