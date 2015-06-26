angular.module('DribbbleApp', [])
    .controller('PostListController', function($http) {

        var postList = this;

        $http.get('http://api.dribbble.com/shots/popular?page=1').success(function(data) {
            postList.posts = data;
        });

    });