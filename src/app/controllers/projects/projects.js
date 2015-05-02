(function (angular) {
    'use strict';

    var module = angular.module('app.controllers.projects', [
        'ng.cork.router',
        'ng.cork.authorization',
        'ng.cork.input-marked',
        'ng.cork.input-tags',
        'ng.cork.prevent-nav',
        'ng.cork.ui.keys',
        'ng.cork.ui.textarea-auto-resize',
        // lib
        'app.services.cork-labs.api',
        'app.services.cork-labs.auth',
        // app
        'app.components.spinner',
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

    module.run([
        '$q',
        'corkRouter',
        'corkAuthorization',
        function run($q, router, authorization) {

            router.addRoute('project.list', {
                path: '/projects',
                section: 'projects',
                templateUrl: 'controllers/projects/list.tpl.html',
                controllerAs: 'listProjects',
                controller: 'listProjectsCtrl',
                title: 'Projects'
            });

            router.addRoute('project.search', {
                path: '/projects/search/:terms*?',
                section: 'projects',
                templateUrl: 'controllers/projects/search.tpl.html',
                controllerAs: 'searchProjects',
                controller: 'searchProjectsCtrl',
                title: 'Search Projects'
            });

            router.addRoute('tag', {
                path: '/tag/:tag',
                section: 'projects',
                templateUrl: 'controllers/projects/search.tpl.html',
                controllerAs: 'searchProjects',
                controller: 'searchProjectsCtrl',
                title: 'Tag'
            });

            router.addRedirect('/projects/search', '/projects/search/');

            router.addRedirect('/', '/projects');

            router.addRoute('project.create', {
                path: '/projects/create',
                section: 'projects',
                templateUrl: 'controllers/projects/edit.tpl.html',
                controllerAs: 'editProject',
                controller: 'editProjectCtrl',
                title: 'Project',
                resolve: {
                    authorize: authorization.$authorizeRoute
                },
                corkAuthorization: {
                    rules: [authorization.middleware('isAdmin')]
                }
            });

            router.addRoute('project.view', {
                path: '/projects/:id',
                section: 'projects',
                templateUrl: 'controllers/projects/view.tpl.html',
                controllerAs: 'viewProject',
                controller: 'viewProjectCtrl',
                title: 'Project'
            });

            router.addRoute('project.edit', {
                path: '/projects/:id/edit',
                section: 'projects',
                templateUrl: 'controllers/projects/edit.tpl.html',
                controllerAs: 'editProject',
                controller: 'editProjectCtrl',
                title: 'Project',
                resolve: {
                    authorize: authorization.$authorizeRoute
                },
                corkAuthorization: {
                    rules: [authorization.middleware('isAdmin')]
                }
            });
        }
    ]);

    module.controller('listProjectsCtrl', [
        '$scope',
        '$q',
        '$http',
        'corkRouter',
        'corkAuthorization',
        'corkLabsApiClient',
        function listProjectsCtrl($scope, $q, $http, router, authorization, apiClient) {
            var listProjects = this;

            var projects = apiClient.service('projects');

            listProjects.create = function () {
                router.goTo('project.create');
            };

            listProjects.view = function (project) {
                router.goTo('project.view', {
                    id: project.id
                });
            };

            listProjects.loading = true;
            $scope.projects = [];
            projects.list().then(function (res) {
                listProjects.loading = false;
                $scope.projects = res;
            });

            $scope.userCan = authorization.allowedActions(['project.create']);
            $scope.$on('corkIdentity.onChange', function () {
                $scope.userCan.$refresh();
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

            var debouncedSearch = corkThrottling.debounce(function (terms, tags) {
                if (terms || terms.length || tags && tags.length) {
                    searchProjects.isPristine = false;
                    searchProjects.loading = 'OLE';
                    $scope.projects = [];
                    $timeout(function () {
                        projects.search($scope.terms, tags).then(function (res) {
                            searchProjects.loading = false;
                            $scope.projects = res;
                        });
                    }, 500);
                }
            });

            searchProjects.tags = [];
            $scope.terms = router.$params.terms || '';
            $scope.tag = router.$params.tag;
            searchProjects.focus = !!$scope.terms || 'auto';
            searchProjects.isPristine = true;
            if ($scope.terms) {
                searchProjects.loading = true;
                searchProjects.isPristine = false;
            }
            if ($scope.tag) {
                searchProjects.loading = true;
                searchProjects.isPristine = false;
                tags.getByName($scope.tag).then(function (tag) {
                    debouncedSearch($scope.terms || '', [tag]);
                });
            }

            searchProjects.tagsOptions = {
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

            searchProjects.onSearch = function (terms) {
                debouncedSearch(terms, $scope.tags);
            };

            $scope.$watch('tags', function (tags) {
                debouncedSearch($scope.terms || '', tags);
            }, true);
        }
    ]);

    module.controller('viewProjectCtrl', [
        '$scope',
        '$q',
        '$http',
        'corkRouter',
        'corkAuthorization',
        'corkLabsApiClient',
        function viewProjectCtrl($scope, $q, $http, router, authorization, apiClient) {
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

            $scope.userCan = authorization.allowedActions(['project.edit']);
            $scope.$on('corkIdentity.onChange', function () {
                $scope.userCan.$refresh();
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
            var editProject = this;

            var id = router.$params.id;
            var isNew = !id;
            var projects = apiClient.service('projects');
            var tags = apiClient.service('tags');

            editProject.isNew = isNew;

            editProject.cancel = function () {
                if (isNew) {
                    router.goTo('project.list');
                } else {
                    router.goTo('project.view', {
                        id: id
                    });
                }
            };

            editProject.save = function () {
                if (!$scope.versionsParseError) {
                    editProject.saving = true;
                    $scope.project.versions = JSON.parse($scope.versionsJSON || []);
                    var method = isNew ? 'create' : 'update';
                    projects[method]($scope.project).then(function (res) {
                        $scope['project-edit'].$setPristine();
                        router.goTo('project.view', {
                            id: res.id
                        });
                    });
                }
            };

            // -- @todo proper version editing

            // @todo executing state, block versions ui, update model/handle errors
            editProject.buildVersion = function (tag) {
                if ($scope.project.id) {
                    projects.build($scope.project, tag);
                }
            };

            // @todo executing state, block versions ui, update model/handle errors
            editProject.setCurrentVersion = function (tag) {
                if (!isNew) {
                    projects.setCurrentVersion($scope.project, tag).then(function () {
                        // @todo hack, this does not update other properties of currentVersion (such as date)
                        // either take a response form the server or implement a client side getVersionByTag() in the project model
                        $scope.project.currentVersion = $scope.project.currentVersion || {};
                        $scope.project.currentVersion.tag = tag;
                    });
                }
            };

            if (isNew) {
                $scope.project = {
                    tags: []
                };
            } else {
                editProject.loading = true;
                projects.get(id).then(function (res) {
                    editProject.loading = false;
                    $scope.project = res;
                    $scope.project.tags = $scope.project.tags || [];
                });
            }

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

            // -- @todo proper version editing

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
