/**
 * @ngdoc module
 * @name app.components.nav.search
 */
angular.module('app.components.nav.search', [
    // app
    'app.templates'
])

/**
 * @ngdoc directive
 * @name navSearch
 *
 * @description
 * global search
 */
.directive('navSearch', [
    '$rootScope',
    '$q',
    function navUser($rootScope, $q) {
        'use strict';

        return {
            templateUrl: 'components/nav/search.tpl.html',
            restrict: 'A',
            scope: {},
            link: function ($scope, $element, $attrs) {

                $scope.expanded = false;

                var expand = function () {
                    $scope.$evalAsync(function () {
                        $scope.expanded = true;
                    });
                };

                var colappse = function () {
                    $scope.$evalAsync(function () {
                        $scope.expanded = false;
                    });
                };

                var input = $element[0].querySelector('.form-control');
                var label = $element[0].querySelector('label');
                label.addEventListener('mousedown', function (ev) {
                    if ($scope.expanded) {
                        ev.preventDefault();
                    }
                }, true);
                input.addEventListener('focus', expand, true);
                input.addEventListener('blur', colappse, true);
            }
        };
    }
])

;
