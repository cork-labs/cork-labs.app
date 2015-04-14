(function (angular) {
    'use strict';

    var module = angular.module('app.components.search', [
        'ng.cork.router',
        'ng.cork.ui.keys',
        'ng.cork.ui.focus-on',
        'ng.cork.ui.stop-propagation',
        // app
        'app.templates'
    ]);

    var isFunction = angular.isFunction;

    module.directive('appNavSearch', [
        '$rootScope',
        '$document',
        'corkRouter',
        function appNavSearchCtrl($rootScope, $document, corkRouter) {

            return {
                templateUrl: 'components/search/nav-search.tpl.html',
                restrict: 'A',
                scope: {},
                link: function ($scope, $element, $attrs) {

                    $scope.expanded = false;

                    $scope.expand = function () {
                        $scope.$evalAsync(function () {
                            $scope.expanded = true;
                        });
                    };

                    $scope.collapse = function () {
                        $scope.$evalAsync(function () {
                            $scope.expanded = false;
                        });
                    };

                    $scope.onSearch = function (terms) {
                        $rootScope.$evalAsync(function () {
                            $scope.collapse();
                            corkRouter.goTo('project.search', {
                                terms: terms
                            });
                        });
                    };

                    $scope.onLabelMouseDown = function ($event) {
                        if (!$scope.expanded) {
                            $scope.expanded = true;
                        }
                        $rootScope.$evalAsync(function () {
                            $scope.$broadcast('app-nav-search.focus');
                        });
                    };

                    var docMouseDown = function () {
                        if ($scope.expanded) {
                            $scope.collapse();
                        }
                    };
                    $document[0].addEventListener('mousedown', docMouseDown);
                    $scope.$on('$destroy', function () {
                        $document[0].removeEventListener('mousedown', docMouseDown);
                    });
                }
            };
        }
    ]);

    module.directive('appSearchTerms', [
        '$rootScope',
        'corkUiKeys',
        function appSearchTermsCtrl($rootScope, corkUiKeys) {

            return {
                templateUrl: 'components/search/terms.tpl.html',
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    terms: '=ngModel',
                    focusOn: '@',
                    searchOnType: '@',
                    showHint: '@',
                    minLength: '@',
                    onSearch: '&',
                    onFocus: '&',
                    onBlur: '&',
                },
                link: function ($scope, $element, $attrs) {

                    $scope.onInputKeyUp = function ($event) {
                        if ((!$scope.minLength || $scope.terms && $scope.terms.length >= $scope.minLength) && isFunction($scope.onSearch)) {
                            $scope.hintVisible = $scope.showHint && !$scope.searchOnType;
                            var code = corkUiKeys.getCode($event);
                            var isEnter = code === corkUiKeys.key.Enter;
                            if (isEnter) {
                                $scope.hintVisible = false;
                            }
                            if ($scope.searchOnType || isEnter) {
                                $rootScope.$evalAsync(function () {
                                    $scope.onSearch({
                                        terms: $scope.terms
                                    });
                                });
                            }
                        } else {
                            $scope.hintVisible = false;
                        }
                    };

                    $scope.onInputFocus = function ($event) {
                        if (isFunction($scope.onFocus)) {
                            $scope.onFocus();
                        }
                    };

                    $scope.onInputBlur = function ($event) {
                        if (isFunction($scope.onBlur)) {
                            $scope.onBlur();
                        }
                    };
                }
            };
        }
    ]);

})(angular);
