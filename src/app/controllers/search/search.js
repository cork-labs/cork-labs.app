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

            var search = apiClient.service('search');

            var debouncedSearch = corkThrottling.debounce(function (terms) {
                if (terms.length) {
                    $scope.loading = true;
                    $scope.search = [];
                    search.search($scope.terms).then(function (res) {
                        $scope.loading = false;
                        $scope.search = res;
                    });
                }
            });

            $scope.terms = router.$params.terms || '';
            $scope.focus = !!$scope.terms || 'auto';

            $scope.onSearch = function (terms) {
                debouncedSearch(terms);
            };

            debouncedSearch($scope.terms);
        }
    ]);

})(angular);
