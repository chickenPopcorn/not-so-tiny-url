/**
 * Created by dyorex on 2016-10-15.
 */
angular.module('tinyurlApp').controller('feedController',
    function($scope, $location, $auth, $window, $rootScope, feedService,
              timeAgo, ModalService) {

        $scope.isLoggedIn = function() {
            return $auth.isAuthenticated();
        };

        $scope.publicItems = [];
        $scope.total = -1;

        $scope.url = $location.protocol() + "://" + $location.host() + ($location.port() !== 80 ? ':'+$location.port() : '') +  "/";

        $scope.loadPublicItems = function() {
            if ($scope.busy) return;
            $scope.busy = true;

            var lastId = $scope.publicItems.length === 0 ? -1 :
                $scope.publicItems[$scope.publicItems.length - 1]._id;
            feedService.getFeed(4, lastId).success(function(data) {
                console.log(data);
                $scope.total = data.count;
                for (var i = 0; i < data.data.length; i++) {
                    $scope.publicItems.push(data.data[i]);
                    data.data[i].isDeletable = isPostDeletable(data.data[i]);

                    data.data[i].fullShortUrl = $scope.url + data.data[i].shortUrl;
                    var url = data.data[i].longUrl ? data.data[i].longUrl :
                        data.data[i].fullShortUrl;
                    $scope.getMeta(url, data.data[i]);
                    $scope.getNumberOfLikes(data.data[i]);
                    $scope.hasLiked(data.data[i]);

                    data.data[i].displayComments = false;
                    getNumberOfComments(data.data[i]);
                }
                $scope.busy = false;

                console.log('total: ' + $scope.total);
                console.log('publicItems: ' + $scope.publicItems.length);
            });
        };

        $scope.getMeta = function(url, item) {
            feedService.getMeta(url).success(function(data) {
                if (data && data.result.status === 'ok') {
                    item.rootUrl = data.meta.rootUrl.replace(/.*?:\/\//g, '');
                    item.title = data.meta.title;
                    item.description = data.meta.description;

                    if (data.meta.image) {
                        item.image = data.meta.image;
                    } else {
                        item.image = data.meta.images[0];
                    }
                }
            });
        };

        $scope.toUrl = function(url) {
            window.open(url, '_blank');
        };

        $scope.getNumberOfLikes = function(item) {
            feedService.getNumberOfLikes(item._id).success(function(data) {
                if (data.status === 'ok') {
                    item.numOfLikes = data.data.count;
                }
            });
        };

        $scope.hasLiked = function(item) {
            feedService.hashLiked(item._id).success(function(data) {
                if (data.status == 'ok') {
                    item.hasLiked = data.data.hasLiked;
                } else {
                    item.hasLiked = false;
                }
            });
        };

        $scope.like = function(item) {
            feedService.like(item._id).success(function(data) {
                item.numOfLikes++;
                item.hasLiked = true;
                // console.log(data);
            });
        };

        $scope.unlike = function(item) {
            feedService.unlike(item._id).success(function() {
                item.numOfLikes--;
                item.hasLiked = false;
            });
        };

        $scope.privateItems = [];
        $scope.loadPrivateItems = function() {
            feedService.getPrivateFeed(10, -1).success(function(data) {
                // console.log(data);
                for (var i = 0; i < data.data.length; i++) {
                    $scope.privateItems.push(data.data[i]);
                    data.data[i].isDeletable = isPostDeletable(data.data[i]);

                    data.data[i].fullShortUrl = $scope.url + data.data[i].shortUrl;
                    var url = data.data[i].longUrl ? data.data[i].longUrl : data.data[i].fullShortUrl;
                    $scope.getMeta(url, data.data[i]);
                }

                console.log('total for private: ' + data.count);
                console.log('privateItems: ' + $scope.privateItems.length);
            });
        };
        $scope.loadPrivateItems();

        $scope.yourPublicItems = [];
        $scope.loadYourPublicItems = function() {
            feedService.getYourPublicURL(10, -1).success(function(data) {
                // console.log(data);
                for (var i = 0; i < data.data.length; i++) {
                    if (isPostDeletable(data.data[i])){
                        $scope.yourPublicItems.push(data.data[i]);
                        data.data[i].isDeletable = true;
                        data.data[i].fullShortUrl = $scope.url + data.data[i].shortUrl;
                        var url = data.data[i].longUrl ? data.data[i].longUrl : data.data[i].fullShortUrl;
                        $scope.getMeta(url, data.data[i]);
                    }
                }
                console.log('total for public: ' + data.count);
                console.log('publicItems: ' + $scope.yourPublicItems.length);
            });
        };
        $scope.loadYourPublicItems();

        // get comments
        var getComments = function(item) {
            feedService.getComments(item._id).success(function(data) {
                if (data.status == 'ok') {
                    item.comments = data.data;

                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].isDeletable =
                            isCommentDeletable(data.data[i]);
                    }
                }
            });
        };

        // get number of comments
        var getNumberOfComments = function(item) {
            feedService.getNumberOfComments(item._id).success(function(data) {
                if (data.status == 'ok') {
                    item.numOfComments = data.data.count;
                }
            });
        };

        // add comment
        $scope.addComment = function(item) {
            if (item.newComment && item.newComment !== '') {
                feedService.addComment(item._id, item.newComment).
                    success(function(data) {
                        data.data.isDeletable = true;
                        item.comments.push(data.data);
                        item.newComment = '';
                        item.numOfComments++;
                    });
            }
        };

        // remove comment
        $scope.removeComment = function(item, comment) {
            // console.log(comment);
            ModalService.showModal({
                templateUrl: '/public/views/fragments/deleteModal.html',
                controller: 'modalController'
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    if (result === 'Yes') {
                        feedService.removeComment(comment._id).
                            success(function() {
                                var index = item.comments.indexOf(comment);
                                item.comments.splice(index, 1);
                                item.numOfComments--;
                            });
                    }
                });
            });
        };

        $scope.toggleComments = function(item) {
            if (item.comments) {
                // no need to load again
            } else {
                getComments(item);
            }

            item.displayComments = !item.displayComments;
        };

        var isCommentDeletable = function(comment) {
            return $rootScope.currentUser && $rootScope.currentUser._id !== -1 &&
                comment.userId === $rootScope.currentUser._id;
        };

        // remove post
        $scope.removePost = function(item) {
            // console.log(item);
            ModalService.showModal({
                templateUrl: '/public/views/fragments/deleteModal.html',
                controller: 'modalController'
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    if (result == 'Yes') {
                        feedService.removePost(item._id).success(function() {
                            if (item.public) {
                                var index = $scope.publicItems.indexOf(item);
                                $scope.publicItems.splice(index, 1);
                            } else {
                                var index = $scope.privateItems.indexOf(item);
                                $scope.privateItems.splice(index, 1);
                            }
                        });
                    }
                });
            });
        };

        var isPostDeletable = function(item) {
            return $rootScope.currentUser && $rootScope.currentUser._id != -1 &&
                item.userId === $rootScope.currentUser._id;
        };
    });
