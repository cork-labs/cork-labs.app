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

        }
    ]);

})(angular);
