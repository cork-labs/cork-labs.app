angular.module('app.controllers.projects', [
    'ngRoute',
    // lib
    'ng.cl.router',
    // app
    'app.controllers.projects.route',
    'app.templates'
])

.config([
    'clRouterProvider',
    'APP_ROUTE_PROJECTS',
    function config(routerProvider, ROUTE_PROJECTS) {
        'use strict';

        routerProvider.addRoute(ROUTE_PROJECTS.projects, {
            path: '/projects',
            templateUrl: 'controllers/projects/projects.tpl.html',
            controller: 'projectsCtrl',
            title: 'Projects'
        });
    }
])

.controller('projectsCtrl', [
    '$q',
    '$http',
    function projectsCtrl($q, $http) {
        'use strict';

        console.log('projectsCtrl');
    }
])

;

