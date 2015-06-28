angular.module('dribbbleApp', ['ngRoute', 'infinite-scroll', 'afkl.lazyImage'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: '/templates/list.html',
            controller: 'PostListController'
        }).when('/item.html', {
            templateUrl: '/templates/item.html',
            controller: 'ItemController'
        });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })
    .controller('PostListController', function($http) {

        var postList = this;

        postList.busy = false;

        postList.page = 0;

        postList.posts = [];

        postList.nextPage = function() {
            if (postList.busy) return;
            postList.busy = true;

            postList.page++;

            $http.jsonp('http://api.dribbble.com/shots/popular?page=' + postList.page + '&callback=JSON_CALLBACK').success(function(data) {

                for (var i = 0; i < data.shots.length; i++) {
                    postList.posts.push(data.shots[i]);
                }

                postList.busy = false;
            });

        };


    }).controller("ItemController", function($routeParams, $http) {

        console.log("ItemController " + $routeParams.id);

        var item = this;

        if (item.busy) return;
        item.busy = true;

        $http.jsonp('http://api.dribbble.com/shots/' + $routeParams.id + '?callback=JSON_CALLBACK').success(function(data) {

            item.post = data;
            item.busy = false;

        });

    });