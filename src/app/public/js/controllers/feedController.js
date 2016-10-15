/**
 * Created by dyorex on 2016-10-15.
 */
angular.module("tinyurlApp")
    .controller("feedController", function($scope, $location, $auth, feedService) {
        $scope.isLoggedIn = function() {
            return $auth.isAuthenticated();
        };

        $scope.publicItems = [];
        $scope.total = -1;

        $scope.loadPublicItems = function() {
            if ($scope.busy) return;
            $scope.busy = true;

            var lastId = $scope.publicItems.length == 0 ? -1 : $scope.publicItems[$scope.publicItems.length - 1]._id;
            feedService.getFeed(10, lastId).success(function(data) {
                // console.log(data);
                $scope.total = data.count;
                for (var i = 0; i < data.data.length; i++) {
                    $scope.publicItems.push(data.data[i]);
                }
                $scope.busy = false;
            });
        };
    });