var app = angular.module("tinyurlApp", ["ngRoute", "ngResource", 'chart.js', 'satellizer', 'ngMessages', 'toggle-switch', 'infinite-scroll']);

app.config(function($routeProvider, $authProvider) {
    // special varible $routeProvider
    $routeProvider.when("/", {
            templateUrl: "./public/views/home.html",
            controller: "homeController"
        })
        .when("/urls/:shortUrl", {
            templateUrl: "./public/views/url.html",
            controller: "urlController"
        })
        .when('/login', {
            templateUrl: './public/views/login.html',
            controller: 'loginController'
        })
        .when('/reg', {
            templateUrl: './public/views/reg.html',
            controller: 'regController'
        })
        .when('/feed', {
            templateUrl: './public/views/feed.html',
            controller: 'feedController'
        });

    $authProvider.loginUrl = '/auth/login';
    $authProvider.signupUrl = '/auth/reg';
})
.run(function($rootScope, $window, $auth) {
    if ($auth.isAuthenticated()) {
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
    }
});
