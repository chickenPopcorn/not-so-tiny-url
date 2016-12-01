angular.module("tinyurlApp")
    .controller("rankController", function($scope, $http, $auth, $window, $rootScope, rankService) {
        var host = 'http://localhost:3000/'; // TODO: should find a way not to hardcode this

        $scope.topkUrls = [];
        console.log("create");

        var getLongUrl = function (shortUrl, clicks) {
            $http.get('/api/v1/urls/' + shortUrl).then(function (res) {
                $scope.topkUrls.push({ shortUrl: host + shortUrl, longUrl: res.data.longUrl, clicks: clicks });
                console.log($scope.topkUrls);
            });
        };

        // rankService.saveUrlClicks().then(function() {
        //     rankService.getTopKUrls(10).success(function(data) {
        //         // console.log(data);
        //         for(var i = 0; i < data.length; i++) {
        //             getLongUrl(data[i].shortUrl, data[i].clicks);
        //         }
        //     });
        // });

        rankService.getAllClicks().success(function (res) {

            console.log(res);

            if (res.data == null) {
                rankService.saveUrlClicks().then(function (res) {
                    console.log(res);
                    rankService.getTopKUrls(10).success(function(data) {
                        console.log(data);
                        for(var i = 0; i < data.length; i++) {
                            getLongUrl(data[i].shortUrl, data[i].clicks);
                        }
                    });
                });
            } else {
                rankService.getTopKUrls(10).success(function(data) {
                    // console.log(data);
                    for(var i = 0; i < data.length; i++) {
                        getLongUrl(data[i].shortUrl, data[i].clicks);
                    }
                });
            }
        });

    });