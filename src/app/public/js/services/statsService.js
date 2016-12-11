angular.module('tinyurlApp').factory('socket', function($location, $rootScope) {
    var socket = io.connect($location.protocol() + "://" + $location.host() + ($location.port() !== 80 ? ':'+$location.port() : ''));
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
