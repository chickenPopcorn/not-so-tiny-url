angular.module('tinyurlApp').controller('rankController',
    function($location, $scope, $http, $auth, $window, $rootScope, feedService, rankService) {
        var host = location.host;

        $scope.topkUrls = [];
        console.log('create');

        var getTitle = function(shortUrl, clicks) {
            $http.get('/api/v1/urls/' + shortUrl).then(function(res) {
                var longUrl = res.data.longUrl;
                // console.log(longUrl);
                feedService.getMeta(longUrl).success(function(data) {
                    if (data && data.result.status === 'ok') {
                        var title = data.meta.title;
                        $scope.topkUrls.push({
                            shortUrl: host + '/' + shortUrl,
                            longUrl: longUrl,
                            title: title,
                            clicks: clicks
                        });
                    }
                });
                //console.log($scope.topkUrls);
            });
        };

        rankService.getAllClicks().success(function(res) {

            // console.log(res);

            if (res.data == null) {
                rankService.saveUrlClicks().then(function(res) {
                    //console.log(res);
                    rankService.getTopKUrls(10).success(function(data) {
                        // console.log(data);
                        for (var i = 0; i < data.length; i++) {
                            getTitle(data[i].shortUrl, data[i].clicks);
                        }
                    });
                });
            } else {
                rankService.getTopKUrls(10).success(function(data) {
                    // console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        getTitle(data[i].shortUrl, data[i].clicks);
                    }
                });
            }
        });

    });
