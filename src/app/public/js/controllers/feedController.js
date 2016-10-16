/**
 * Created by dyorex on 2016-10-15.
 */
angular.module("tinyurlApp")
    .controller("feedController", function($scope, $location, $auth, feedService, timeAgo) {
        $scope.isLoggedIn = function() {
            return $auth.isAuthenticated();
        };

        $scope.publicItems = [];
        $scope.total = -1;

        $scope.loadPublicItems = function() {
            if ($scope.busy) return;
            $scope.busy = true;

            var lastId = $scope.publicItems.length == 0 ? -1 : $scope.publicItems[$scope.publicItems.length - 1]._id;
            feedService.getFeed(4, lastId).success(function(data) {
                // console.log(data);
                $scope.total = data.count;
                for (var i = 0; i < data.data.length; i++) {
                    $scope.publicItems.push(data.data[i]);

                    var url = data.data[i].longUrl ? data.data[i].longUrl : 'localhost:3000/' + data.data[i].shortUrl;
                    $scope.getMeta(url, data.data[i]);
                    $scope.getNumberOfLikes(data.data[i]);
                    $scope.hasLiked(data.data[i]);
                }
                $scope.busy = false;

                console.log('total: ' + $scope.total);
                console.log('publicItems: ' + $scope.publicItems.length);
            });
        };

        $scope.getMeta = function(url, item) {
            feedService.getMeta(url).success(function(data) {
                if (data.result.status == 'ok') {
                    item.rootUrl = data.meta.rootUrl.replace(/.*?:\/\//g, "");
                    item.title = data.meta.title;
                    item.description = data.meta.description;

                    if (data.meta.image) {
                        item.image = data.meta.image;
                    } else {
                        item.image = data.meta.images[0];
                    }
                }
            });
        };

        $scope.toUrl = function(url) {
            window.open(url, '_blank');
        };

        $scope.getNumberOfLikes = function(item) {
            feedService.getNumberOfLikes(item._id).success(function(data) {
                if (data.status == 'ok') {
                    item.numOfLikes = data.data.count;
                }
            });
        };

        $scope.hasLiked = function(item) {
            feedService.hashLiked(item._id).success(function(data) {
                if (data.status == 'ok') {
                    item.hasLiked = data.data.hasLiked;
                } else {
                    item.hasLiked = false;
                }
            });
        };

        $scope.like = function(item) {
            feedService.like(item._id).success(function(data) {
                item.numOfLikes++;
                item.hasLiked = true;
                // console.log(data);
            });
        };

        $scope.unlike = function(item) {
            feedService.unlike(item._id).success(function() {
                item.numOfLikes--;
                item.hasLiked = false;
            });
        }
    });