(function (angular) {
    'use strict';

    var module = angular.module('app.controllers.projects', [
        'ng.cork.router',
        // lib
        'ng.cork.input-marked',
        'ng.cork.input-tags',
        'ng.cork.prevent-nav',
        'ng.cork.ui.keys',
        'cork-labs.api',
        // app
        'app.components.project-list',
        'app.components.project-details',
        'app.components.project-assets',
        'app.templates'
    ]);

    var isArray = angular.isArray;

    var trimReadme = function (text) {
        if (text) {
            var ix = text.indexOf('##');
            if (ix !== -1) {
                return text.substr(ix);
            }
            return text;
        }
        return '';
    };

    module.config([
        'corkRouterProvider',
        function config(routerProvider) {

            routerProvider.addRoute('project.list', {
                path: '/projects',
                section: 'projects',
                templateUrl: 'controllers/projects/list.tpl.html',
                controllerAs: 'listProjects',
                controller: 'listProjectsCtrl',
                title: 'Projects'
            });

            routerProvider.addRoute('project.search', {
                path: '/projects/search/:terms*?',
                section: 'projects',
                templateUrl: 'controllers/projects/search.tpl.html',
                controllerAs: 'searchProjects',
                controller: 'searchProjectsCtrl',
                title: 'Search Projects'
            });

            routerProvider.addRedirect('/projects/search', '/projects/search/');

            routerProvider.addRoute('project.view', {
                path: '/projects/:id',
                section: 'projects',
                templateUrl: 'controllers/projects/view.tpl.html',
                controllerAs: 'viewProject',
                controller: 'viewProjectCtrl',
                title: 'Project'
            });

            routerProvider.addRoute('project.edit', {
                path: '/projects/:id/edit',
                section: 'projects',
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

    module.controller('searchProjectsCtrl', [
        '$rootScope',
        '$timeout',
        '$scope',
        '$q',
        '$http',
        'corkRouter',
        'corkThrottling',
        'corkUiKeys',
        'corkLabsApiClient',
        function searchProjectsCtrl($rootScope, $timeout, $scope, $q, $http, router, corkThrottling, corkUiKeys, apiClient) {
            var searchProjects = this;

            searchProjects.view = function (project) {
                router.goTo('project.view', {
                    id: project.id
                });
            };

            var projects = apiClient.service('projects');
            var tags = apiClient.service('tags');

            var debouncedSearch = corkThrottling.debounce(function (terms) {
                if (terms.length || $scope.tags.length) {
                    $scope.isPristine = false;
                    $scope.loading = true;
                    $scope.projects = [];
                    $timeout(function () {
                        projects.search($scope.terms, $scope.tags).then(function (res) {
                            $scope.loading = false;
                            $scope.projects = res;
                        });
                    }, 1000);
                }
            });

            $scope.tags = [];
            $scope.terms = router.$params.terms || '';
            $scope.focus = !!$scope.terms || 'auto';
            $scope.isPristine = true;
            if ($scope.terms) {
                $scope.isPristine = false;
            }

            $scope.tagsOptions = {
                placeholder: 'ex: AngularJS',
                attr: {
                    label: 'name'
                },
                display: {
                    tags: 'hide'
                },
                searchFn: function (terms) {
                    return tags.search(terms);
                }
            };

            $scope.onSearch = function (terms) {
                console.log('search', terms);
                debouncedSearch(terms);
            };

            $scope.$watch('tags', function () {
                console.log('tags', $scope.terms, $scope.tags);
                debouncedSearch($scope.terms);
            }, true);
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
                $scope.readme = trimReadme($scope.project.readme);
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
                if (!$scope.versionsParseError) {
                    viewProject.saving = true;
                    $scope.project.versions = JSON.parse($scope.versionsJSON || []);
                    projects.update($scope.project).then(function (res) {
                        $scope['project-edit'].$setPristine();
                        router.goTo('project.view', {
                            id: id
                        });
                    });
                }
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

            $scope.$watch('project.versions', function (val) {
                $scope.versionsJSON = JSON.stringify(isArray(val) ? val : []);
            });

            $scope.$watch('versionsJSON', function (val) {
                try {
                    $scope.versions = JSON.parse(val || '[]');
                    $scope.versionsParseError = false;
                } catch (e) {
                    $scope.versionsParseError = true;
                }
            });

            preventNav.addInterceptor(function () {
                return !$scope['project-edit'] || !$scope['project-edit'].$dirty;
            }, null, 'Changes made to this project will be lost.');
        }
    ]);
})(angular);
