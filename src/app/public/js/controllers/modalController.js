/**
 * Created by dyorex on 2016-11-21.
 */
angular.module('tinyurlApp').
    controller('modalController', function($scope, close) {

        $scope.close = function(result) {
            close(result, 500); // close, but give 500ms for bootstrap to
                                // animate
        };

    });
