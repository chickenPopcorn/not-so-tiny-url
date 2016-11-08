/**
 * Created by dyorex on 2016-10-14.
 */
angular.module('tinyurlApp')
    .directive('serverMessage', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                element.on('keydown', function() {
                    ctrl.$setValidity('server', true)
                });
            }
        }
    });