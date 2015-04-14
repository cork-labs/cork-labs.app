(function (angular) {
    'use strict';

    var module = angular.module('app.controllers.content', [
        'ng.cork.router',
        // app
        'app.templates'
    ]);

    module.config([
        'corkRouterProvider',
        function config(routerProvider) {

            routerProvider.addRoute('content', {
                path: '/:path*',
                templateUrl: 'controllers/content/content.tpl.html',
                controllerAs: 'content',
                controller: 'contentCtrl'
            });
        }
    ]);

    module.controller('contentCtrl', [
        '$q',
        '$http',
        function contentCtrl($q, $http) {

            console.log('contentCtrl');
        }
    ]);

})(angular);
