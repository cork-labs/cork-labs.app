(function (angular) {
    'use strict';

    var module = angular.module('app', [
        'ngRoute',
        'ng.cx.config',
        // app
        'app.config',
        'app.controllers.home',
        'app.controllers.projects',
        'app.controllers.about',
        'app.controllers.content',
        'app.components.nav.search'
    ]);

    module.config([
        '$routeProvider',
        '$locationProvider',
        'cxConfigProvider',
        'configData',
        function appConfig(
            $routeProvider, $locationProvider,
            configProvider,
            configData
        ) {

            $locationProvider.html5Mode(true).hashPrefix('!');

            configProvider.merge(configData);
        }
    ]);

    module.run([
        '$rootScope',
        '$route',
        '$location',
        function ($rootScope, $route, $location) {}
    ]);

    module.controller('appCtrl', [
        '$scope',
        '$rootScope',
        '$route',
        '$q',
        '$location',
        '$window',
        '$timeout',
        function ($scope, $rootScope, $route, $q, $location, $window, $timeout) {

            $rootScope.route = $route;

        }
    ]);

})(angular);
