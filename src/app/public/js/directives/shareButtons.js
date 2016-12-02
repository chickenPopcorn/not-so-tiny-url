/**
 * Created by dyorex on 2016-11-20.
 */
angular.module('tinyurlApp')
    .directive('shareButtons', function (feedService) {
        return {
            restrict: 'A',
            templateUrl: '/public/views/fragments/shareButtons.html',
            scope: {
                // item: '=',
                longUrl: '@',
                shortUrlToShow: '@'
            },
            link: function (scope, element, attrs) {
                scope.showButtons = false;
                scope.toggleBtns = function () {
                    scope.showButtons = !scope.showButtons;
                };
                /* if (scope.item == false) {
                 scope.item = {};
                 scope.item.longUrl = scope.longUrl;
                 scope.item.fullShortUrl = scope.shortUrlToShow;

                 feedService.getMeta(scope.longUrl).success(function(data) {
                 if (data && data.result.status == 'ok') {
                 scope.item.rootUrl = data.meta.rootUrl.replace(/.*?:\/\//g, "");
                 scope.item.title = data.meta.title;
                 scope.item.description = data.meta.description;

                 if (data.meta.image) {
                 scope.item.image = data.meta.image;
                 } else {
                 scope.item.image = data.meta.images[0];
                 }
                 }
                 });
                 } */
            }
        };
    });
