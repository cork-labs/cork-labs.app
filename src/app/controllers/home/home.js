(function (angular) {
    'use strict';

    var module = angular.module('app.controllers.home', [
        'ng.cork.router',
        // lib
        // app
        'app.templates'
    ]);

    module.run([
        'corkRouter',
        function run(router) {

            router.addRoute('home', {
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

        }
    ]);

})(angular);
