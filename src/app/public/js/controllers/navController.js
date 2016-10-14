/**
 * Created by dyorex on 2016-10-14.
 */
angular.module('tinyurlApp')
    .controller('navController', function($scope, $auth, $window, $location) {

        $scope.logout = function() {
            $auth.logout();
            delete $window.localStorage.currentUser;
            $location.path('/login');
        };

        $scope.isLoggedIn = function() {
            return $auth.isAuthenticated();
        };

    });