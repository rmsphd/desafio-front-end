angular.module('DribbbleApp', ['infinite-scroll'])
    .controller('PostListController ', function($http) {

        var postList = this;

        postList.busy = false;

        postList.page = 0;

        postList.posts = [];

        postList.nextPage = function() {

            postList.busy = true;

            postList.page++;

            $http.get('http://api.dribbble.com/shots/popular?page=' + postList.page).success(function(data) {

                for (var i = 0; i < data.shots.length; i++) {
                    postList.posts.push(data.shots[i]);
                }

                postList.busy = false;
            });

        };

        postList.nextPage();


    });