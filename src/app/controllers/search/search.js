(function (angular) {
    'use strict';

    var module = angular.module('app.controllers.search', [
        'ng.cork.router',
        'ng.cork.throttling',
        'ng.cork.input-tags',
        'ng.cork.ui.keys',
        // lib
        'app.services.cork-labs.api',
        // app
        'app.templates'
    ]);

    module.run([
        'corkRouter',
        function run(router) {

            router.addRoute('search', {
                path: '/search/:terms*?',
                templateUrl: 'controllers/search/search.tpl.html',
                controllerAs: 'search',
                controller: 'searchCtrl',
                title: 'Search'
            });

            router.addRedirect('/search', '/search/');
        }
    ]);

    module.controller('searchCtrl', [
        '$rootScope',
        '$scope',
        '$q',
        '$http',
        'corkRouter',
        'corkThrottling',
        'corkUiKeys',
        'corkLabsApiClient',
        function searchCtrl($rootScope, $scope, $q, $http, router, corkThrottling, corkUiKeys, apiClient) {

            var search = function (terms) {
                if (terms.length) {
                    router.goTo('project.search', {
                        terms: terms
                    });
                }
            };

            $scope.terms = router.$params.terms || '';
            $scope.focus = !!$scope.terms || 'auto';

            $scope.onSearch = function () {
                search($scope.terms);
            };
        }
    ]);

})(angular);
