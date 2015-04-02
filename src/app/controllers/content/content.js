angular.module('app.controllers.content', [
    'ngRoute',
    // lib
    'ng.cork.router',
    // app
    'app.controllers.content.route',
    'app.templates'
])

.config([
    'corkRouterProvider',
    'APP_ROUTE_CONTENT',
    function config(routerProvider, ROUTE_CONTENT) {
        'use strict';

        routerProvider.addRoute(ROUTE_CONTENT.content, {
            path: '/:path*',
            templateUrl: 'controllers/content/content.tpl.html',
            controller: 'contentCtrl'
        });
    }
])

.controller('contentCtrl', [
    '$q',
    '$http',
    function contentCtrl($q, $http) {
        'use strict';

        console.log('contentCtrl');
    }
])

;
