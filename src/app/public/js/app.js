var app = angular.module("tinyurlApp", ["ngRoute", "ngResource", 'ngAnimate', 'angularModalService', 'chart.js', 'satellizer', 'ngMessages', 'toggle-switch', 'infinite-scroll', 'yaru22.angular-timeago', 'angularMoment', '720kb.socialshare']);

app.config(function ($routeProvider, $authProvider) {
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
        })
        .when('/rank', {
            templateUrl: './public/views/rank.html',
            controller: 'rankController'
        });

    $authProvider.loginUrl = '/auth/login';
    $authProvider.signupUrl = '/auth/reg';
})
    .run(function ($rootScope, $window, $auth) {
        if ($auth.isAuthenticated()) {
            $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
        }
    });
