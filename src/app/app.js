angular.module('app', [
    'ngRoute',
    //
    'az.config',
    // app
    'app.config',
    'app.services.content',
    'app.controllers.home',
    'app.controllers.content',
    'app.components.nav.search'
])

.config([
    '$routeProvider',
    '$locationProvider',
    'azConfigProvider',
    'configData',
    function appConfig(
        $routeProvider, $locationProvider,
        configProvider,
        configData
    ) {
        'use strict';

        $locationProvider.html5Mode(true).hashPrefix('!');

        configProvider.merge(configData);
    }
])

.run([
    '$rootScope',
    '$route',
    '$location',
    function ($rootScope, $route, $location) {
        'use strict';
    }
])

.controller('appCtrl', [
    '$scope',
    '$rootScope',
    '$route',
    '$q',
    '$location',
    '$window',
    '$timeout',
    'APP_ROUTE_HOME',
    function (
        $scope, $rootScope, $route, $q, $location, $window, $timeout,
        ROUTE_HOME
    ) {
        'use strict';

    }
])

;

