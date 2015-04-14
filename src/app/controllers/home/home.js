(function (angular) {
    'use strict';

    var module = angular.module('app.controllers.home', [
        'ng.cork.router',
        // app
        'app.templates'
    ]);

    module.config([
        'corkRouterProvider',
        function config(routerProvider) {

            routerProvider.addRoute('home', {
                path: '/',
                templateUrl: 'controllers/home/home.tpl.html',
                controllerAs: 'home',
                controller: 'homeCtrl',
                title: 'Home'
            });
        }
    ]);

    module.controller('homeCtrl', [
        '$q',
        '$http',
        function homeCtrl($q, $http) {

            console.log('homeCtrl');
        }
    ]);

})(angular);
