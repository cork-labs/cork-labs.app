angular.module('app.controllers.home', [
    'ngRoute',
    // lib
    'az.router',
    // app
    'app.controllers.home.route',
    'app.templates'
])

.config([
    'azRouterProvider',
    'APP_ROUTE_HOME',
    function config(routerProvider, ROUTE_HOME) {
        'use strict';

        routerProvider.addRoute(ROUTE_HOME.home, {
            pattern: '/',
            templateUrl: 'controllers/home/home.tpl.html',
            controller: 'homeCtrl',
            title: 'Home'
        });
    }
])

.controller('homeCtrl', [
    '$q',
    '$http',
    function homeCtrl($q, $http) {
        'use strict';

        console.log('homeCtrl');
    }
])

;

