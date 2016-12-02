angular.module('tinyurlApp')
    .controller('homeController', ['$scope', '$http', '$location', '$auth', function ($scope, $http, $location, $auth) {
        $scope.submit = function () {
            $http.post('/api/v1/urls', {
                longUrl: $scope.longUrl,
                isPublic: $scope.isPublic
            }).then(function (response) {
                $location.path('/urls/' + response.data.shortUrl);
            }).catch(function (response) {
                $scope.errorMessage = {};
                console.log(response.data);
                angular.forEach(response.data.message, function (message, field) {
                    $scope.homeForm[field].$setValidity('server', false);
                    $scope.errorMessage[field] = response.data.message[field];
                });
            });
        };

        $scope.isLoggedIn = function () {
            return $auth.isAuthenticated();
        };
    }]);
//$scope, linked view variable and controller variable
