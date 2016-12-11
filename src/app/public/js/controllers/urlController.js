angular.module('tinyurlApp').controller('urlController',
    ['$location', '$scope', '$http', '$routeParams', 'moment', 'socket',
        function($location, $scope, $http, $routeParams, moment, socket) {
            $http.get('/api/v1/urls/' + $routeParams.shortUrl).
                success(function(data) {
                    $scope.longUrl = data.longUrl;
                    $scope.shortUrl = data.shortUrl;
                    $scope.shortUrlToShow =
                        $location.protocol() + "://" + $location.host() + ($location.port() !== 80 ? ':'+$location.port() : '') +  "/";+ data.shortUrl;
                });
            var renderTotalClicks = function() {
                $http.get(
                    '/api/v1/urls/' + $routeParams.shortUrl + '/totalClicks').
                    success(function(data) {
                        $scope.totalClicks = data;
                    });
            };


            var renderChart = function(chart, infos) {
                $scope[chart + 'Labels'] = [];
                $scope[chart + 'Data'] = [];
                $scope[chart + 'chartOptions'] = {
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0,

                            }
                        }],
                        xAxes: [{
                            ticks: {
                                min: 0,
                            }
                        }]
                    }
                };
                $http.get(
                    '/api/v1/urls/' + $routeParams.shortUrl + '/' + infos).
                    success(function(data) {
                        data.forEach(function(info) {
                            $scope[chart + 'Labels'].push(info._id);
                            $scope[chart + 'Data'].push(info.count);
                        });
                    });
            };

            $scope.hour = 'hour';
            $scope.day = 'day';
            $scope.month = 'month';
            $scope.time = $scope.hour;
            $scope.getTime = function(time) {
                $scope.lineLabels = [];
                $scope.lineData = [];
                $scope.time = time;
                $scope.chartOptions = {
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0,

                            }
                        }]

                    }
                };
                $http.get('/api/v1/urls/' + $routeParams.shortUrl + '/' + time).
                    success(function(data) {
                        data.forEach(function(item) {
                            var localTime = moment.utc(
                                item._id.month + '-' + item._id.day + ' ' +
                                item._id.hour + ':' + item._id.minutes,
                                'MM-DD hh:mm').local();
                            var legend = '';
                            if (time === 'hour') {
                                legend = localTime.format('hh:mm a');
                            }
                            if (time === 'day') {
                                legend = localTime.format('hh:00 a');
                            }
                            if (time === 'month') {
                                legend = localTime.format('MM/DD');
                            }
                            $scope.lineLabels.push(legend);
                            $scope.lineData.push(item.count);
                        });
                    });
            };

            var renderTime = function() {
                $scope.getTime($scope.time);
            };

            function renderAll() {
                renderTotalClicks();
                renderChart('doughnut', 'referer');
                renderChart('pie', 'country');
                renderChart('base', 'platform');
                renderChart('bar', 'browser');
                renderTime();
            };

            renderAll();

            socket.on('shortUrlVisited', function(visitedShortUrl) {
                if ($scope.shortUrl === visitedShortUrl) {
                    renderAll();
                }
            });


        }]);
