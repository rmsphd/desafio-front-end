angular.module('dribbbleApp', ['ngRoute', 'infinite-scroll', 'afkl.lazyImage'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: '/templates/list.html',
            controller: 'PostListController as postList'
        }).when('/item.html', {
            templateUrl: '/templates/item.html',
            controller: 'ItemController as item'
        });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })
    .controller('PostListController', function($http, $location) {

        var postList = this;

        postList.busy = false;

        postList.page = 0;

        postList.posts = [];

        postList.go = function(path) {
            $location.path("item.html").search("id=" + path);
        };

        postList.nextPage = function() {
            if (postList.busy) return;
            postList.busy = true;

            postList.page++;

            if (postList.page > postList.maxpage) return;

            $http.jsonp('http://api.dribbble.com/shots/popular?page=' + postList.page + '&callback=JSON_CALLBACK', {
                cache: true
            }).success(function(data) {

                postList.maxpage = data.pages;

                for (var i = 0; i < data.shots.length; i++) {
                    postList.posts.push(data.shots[i]);
                }

                postList.busy = false;
            });

        };


    }).controller("ItemController", function($routeParams, $http) {

        var item = this;

        if (item.busy) return;
        item.busy = true;

        $http.jsonp('http://api.dribbble.com/shots/' + $routeParams.id + '?callback=JSON_CALLBACK', {
            cache: true
        }).success(function(data) {

            item.post = data;
            document.getElementById('description').innerHTML = item.post.description;
            item.busy = false;

        });

    });