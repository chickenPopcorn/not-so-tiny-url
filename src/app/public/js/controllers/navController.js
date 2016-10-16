/**
 * Created by dyorex on 2016-10-14.
 */
angular.module('tinyurlApp')
    .controller('navController', function($scope, $auth, $window, $location, $http) {

        $scope.logout = function() {
            $auth.logout();
            delete $window.localStorage.currentUser;
            $location.path('/login');
        };

        $scope.isLoggedIn = function() {
            return $auth.isAuthenticated();
        };

        $scope.submit = function() {
            $http.post("/api/v1/urls", {
                longUrl: $scope.longUrl,
                isPublic: false
            }).success(function(data) {
                $location.path("/urls/" + data.shortUrl);
                $scope.longUrl = null;
            });
        };

        $scope.$watch(function(){
            return $location.path();
        }, function(value){
            // console.log(value);
            $scope.currentPath = value;
        });

    });