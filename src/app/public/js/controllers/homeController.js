angular.module("tinyurlApp")
    .controller("homeController", ["$scope", "$http", "$location", "$auth", function($scope, $http, $location, $auth) {
        $scope.submit = function() {
            $http.post("/api/v1/urls", {
                longUrl: $scope.longUrl,
                isPublic: $scope.isPublic
            }).success(function(data) {
                $location.path("/urls/" + data.shortUrl);
            });
        };

        $scope.isLoggedIn = function() {
            return $auth.isAuthenticated();
        };
    }]);
//$scope, linked view variable and controller variable
