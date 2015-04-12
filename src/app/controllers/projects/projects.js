(function (angular) {
    'use strict';

    var module = angular.module('app.controllers.projects', [
        'ngRoute',
        'ng.cork.router',
        // lib
        'ng.cork.input-marked',
        'ng.cork.input-tags',
        'ng.cork.prevent-nav',
        'cork-labs.api',
        // app
        'app.components.project-details',
        'app.components.project-assets',
        'app.templates'
    ]);

    module.config([
        'corkRouterProvider',
        function config(routerProvider) {

            routerProvider.addRoute('project.list', {
                path: '/projects',
                templateUrl: 'controllers/projects/list.tpl.html',
                controllerAs: 'listProjects',
                controller: 'listProjectsCtrl',
                title: 'Projects'
            });

            routerProvider.addRoute('project.view', {
                path: '/projects/:id',
                templateUrl: 'controllers/projects/view.tpl.html',
                controllerAs: 'viewProject',
                controller: 'viewProjectCtrl',
                title: 'Project'
            });

            routerProvider.addRoute('project.edit', {
                path: '/projects/:id/edit',
                templateUrl: 'controllers/projects/edit.tpl.html',
                controllerAs: 'editProject',
                controller: 'editProjectCtrl',
                title: 'Project'
            });
        }
    ]);

    module.controller('listProjectsCtrl', [
        '$scope',
        '$q',
        '$http',
        'corkRouter',
        'corkLabsApiClient',
        function listProjectsCtrl($scope, $q, $http, router, apiClient) {
            var listProjects = this;

            var projects = apiClient.service('projects');

            listProjects.add = function () {
                console.log('!');
            };

            listProjects.view = function (project) {
                router.goTo('project.view', {
                    id: project.id
                });
            };

            listProjects.loading = true;
            projects.list().then(function (res) {
                listProjects.loading = false;
                $scope.projects = res;
            });
        }
    ]);

    module.controller('viewProjectCtrl', [
        '$scope',
        '$q',
        '$http',
        'corkRouter',
        'corkLabsApiClient',
        function viewProjectCtrl($scope, $q, $http, router, apiClient) {
            var viewProject = this;

            var projects = apiClient.service('projects');

            var id = router.$params.id;

            viewProject.edit = function () {
                router.goTo('project.edit', {
                    id: id
                });
            };

            viewProject.loading = true;
            projects.get(id).then(function (res) {
                viewProject.loading = false;
                $scope.project = res;
            });
        }
    ]);

    module.controller('editProjectCtrl', [
        '$scope',
        '$q',
        '$http',
        'corkRouter',
        'corkPreventNav',
        'corkLabsApiClient',
        function editProjectCtrl($scope, $q, $http, router, preventNav, apiClient) {
            var viewProject = this;

            var id = router.$params.id;
            var projects = apiClient.service('projects');
            var tags = apiClient.service('tags');

            viewProject.cancel = function () {
                router.goTo('project.view', {
                    id: id
                });
            };

            viewProject.save = function () {
                viewProject.saving = true;
                projects.update($scope.project).then(function (res) {
                    $scope['project-edit'].$setPristine();
                    router.goTo('project.view', {
                        id: id
                    });
                });
            };

            viewProject.loading = true;
            projects.get(id).then(function (res) {
                viewProject.loading = false;
                $scope.project = res;
                $scope.project.tags = $scope.project.tags || [];
            });

            $scope.tagsOptions = {
                attr: {
                    label: 'name'
                },
                searchFn: function (terms) {
                    return tags.search(terms);
                },
                addFn: function (label) {
                    var tag = {
                        name: label
                    };
                    return tags.create(tag);
                }
            };

            preventNav.addInterceptor(function () {
                return !$scope['project-edit'] || !$scope['project-edit'].$dirty;
            }, null, 'Changes made to this project will be lost.');
        }
    ]);

})(angular);
