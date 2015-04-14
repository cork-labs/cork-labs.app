(function (angular) {
    'use strict';

    var module = angular.module('app', [
        'ng.cx.config',
        // app
        'app.config',
        'app.controllers.home',
        'app.controllers.projects',
        'app.controllers.search',
        'app.controllers.about',
        'app.controllers.content', // must be last, has a catch all
        'app.components.search'
    ]);

    module.config([
        '$locationProvider',
        'cxConfigProvider',
        'configData',
        function appConfig(
            $locationProvider,
            configProvider,
            configData
        ) {

            $locationProvider.html5Mode(true).hashPrefix('!');

            configProvider.merge(configData);
        }
    ]);

    module.run([
        '$rootScope',
        '$location',
        'corkRouter',
        function ($rootScope, $location) {}
    ]);

    module.controller('appCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$location',
        '$window',
        '$timeout',
        'corkRouter',
        function ($scope, $rootScope, $q, $location, $window, $timeout, corkRouter) {

            $rootScope.router = corkRouter;
        }
    ]);

})(angular);
