angular.module("tinyurlApp")
    .controller("urlController", ["$scope", "$http", "$routeParams", 'moment', function($scope, $http, $routeParams, moment) {
        $http.get("/api/v1/urls/" + $routeParams.shortUrl)
            .success(function(data) {
                $scope.longUrl = data.longUrl;
                $scope.shortUrl = data.shortUrl;
                $scope.shortUrlToShow = "http://localhost:3000/" + data.shortUrl;
            });
        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/totalClicks")
            .success(function(data) {
                $scope.totalClicks = data;
            });

        var renderChart = function(chart, infos) {
            $scope[chart + "Labels"] = [];
            $scope[chart + "Data"] = [];
            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + infos)
                .success(function(data) {
                    data.forEach(function(info) {
                        $scope[chart + "Labels"].push(info._id);
                        $scope[chart + "Data"].push(info.count);
                    });
                });
        };
        renderChart("doughnut", "referer");
        renderChart("pie", "country");
        renderChart("base", "platform");
        renderChart("bar", "browser");

        $scope.hour = "hour";
        $scope.day = "day";
        $scope.month = "month";
        $scope.time = $scope.hour;

        var largest = 0;
        $scope.getTime = function(time) {
            $scope.lineLabels = [];
            $scope.lineData = [];
            $scope.time = time;
            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + time)
                .success(function(data) {
                    data.forEach(function(item) {
                        var localTime = moment
                            .utc(item._id.month+"-"+item._id.day+" "+item._id.hour+":"+item._id.minutes,
                                "MM-DD hh:mm").local();
                        var legend = "";
                        if (time === "hour") {
                            legend = localTime.format("hh:mm a");
                        }
                        if (time === "day") {
                            legend = localTime.format("hh:mm a");
                        }
                        if (time === "month") {
                            legend = localTime.format("MM/DD");
                        }
                        $scope.lineLabels.push(legend);
                        largest = largest > item.count ? largest: item.count
                        $scope.lineData.push(item.count);
                        $scope.chartOptions = {
                            scales:{
                                yAxes:[{
                                    ticks: {
                                        max: largest*2,
                                        min: 0,
                                        stepSize: 1
                                    }
                                }]

                            }
                        };
                    });
                });
        };



        $scope.getTime($scope.time);
    }]);
