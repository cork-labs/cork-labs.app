angular.module('app.controllers.about', [
    'ngRoute',
    // lib
    'ng.cork.router',
    // app
    'app.controllers.about.route',
    'app.templates'
])

.config([
    'corkRouterProvider',
    'APP_ROUTE_ABOUT',
    function config(routerProvider, ROUTE_ABOUT) {
        'use strict';

        routerProvider.addRoute(ROUTE_ABOUT.about, {
            path: '/about',
            templateUrl: 'controllers/about/about.tpl.html',
            controller: 'aboutCtrl',
            title: 'About'
        });
    }
])

.controller('aboutCtrl', [
    '$q',
    '$http',
    function aboutCtrl($q, $http) {
        'use strict';

        console.log('aboutCtrl');
    }
])

;
