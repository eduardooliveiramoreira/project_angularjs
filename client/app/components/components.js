import angular from 'angular';

var app = angular.module('app', ['infinite-scroll']);

app.controller('TestController', function ($scope, appFactory) {
    $scope.more = new appFactory.LoadMore($scope);
})

app.factory('appFactory', function ($http, $scope, $q) {

    $scope.publicKey = "5234a931fdd1da574fb6133e31a6d02c";
    $scope.baseUrl = "http://gateway.marvel.com/v1/public";

    var limit = 50;
    var find = function () {
        var def = $q.defer();
        var url = $scope.baseUrl + '/characters?limit=' + limit + '&apikey=' + $scope.publicKey;
        $http.get(url).success(def.resolve).error(def.reject);

        return def.promise;
    };
    var findNext = function (offset) {
        var def = $q.defer();
        var url = $scope.baseUrl + 'public/characters?limit=' + limit + '&offset=' + (limit * offset) + '&apikey=' + $scope.publicKey;
        $http.get(url).success(def.resolve).error(def.reject);

        return def.promise;
    };
    var LoadMore = function ($scope) {
        this.offset = 0;
        this.busy = false;
        this.characters = [];
        this.load = function () {
            if (this.busy) {
                return;
            }
            this.busy = true;
            findNext(this.offset).then(function (results) {
                var chars = results.data.results;
                chars.forEach(function (item) {
                    this.characters.push(item);
                }.bind(this));
                this.offset++;
                this.busy = false;
            }.bind(this));
        }.bind(this);
    };

    return {
        LoadMore: LoadMore
    };
});


export default app;
