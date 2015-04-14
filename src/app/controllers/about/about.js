(function (angular) {
    'use strict';

    var module = angular.module('app.controllers.about', [
        'ng.cork.router',
        // app
        'app.templates'
    ]);

    module.config([
        'corkRouterProvider',
        function config(routerProvider) {

            routerProvider.addRoute('about', {
                path: '/about',
                section: 'about',
                templateUrl: 'controllers/about/about.tpl.html',
                controllerAs: 'about',
                controller: 'aboutCtrl',
                title: 'About'
            });
        }
    ]);

    module.controller('aboutCtrl', [
        '$q',
        '$http',
        function aboutCtrl($q, $http) {

            console.log('aboutCtrl');
        }
    ]);

})(angular);
