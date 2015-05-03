(function (angular) {
    'use strict';

    var module = angular.module('app.controllers.content', [
        'ng.cork.router',
        // lib
        // app
        'app.templates'
    ]);

    module.run([
        'corkRouter',
        function run(router) {

            router.addRoute('content', {
                path: '/:path*',
                templateUrl: 'controllers/content/not-found.tpl.html',
                controllerAs: 'content',
                controller: 'notFoundCtrl'
            });
        }
    ]);

    module.controller('notFoundCtrl', [
        '$q',
        '$http',
        function notFoundCtrl($q, $http) {

        }
    ]);

})(angular);
