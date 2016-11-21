/**
 * Created by dyorex on 2016-11-20.
 */
angular.module('tinyurlApp')
    .directive('shareButtons', function() {
        return {
            restrict: 'A',
            templateUrl: '/public/views/fragments/shareButtons.html',
            scope: {
                item: '='
            },
            link: function(scope, element, attrs) {

            }
        }
    });