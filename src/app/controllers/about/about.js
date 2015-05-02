(function (angular) {
    'use strict';

    var module = angular.module('app.controllers.about', [
        'ng.cork.router',
        // lib
        // app
        'app.templates'
    ]);

    module.run([
        'corkRouter',
        function run(router) {

            router.addRoute('about', {
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

        }
    ]);

})(angular);
