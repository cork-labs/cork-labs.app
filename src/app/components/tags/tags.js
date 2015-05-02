(function (angular) {
    'use strict';

    var module = angular.module('app.components.tags', [
        'ng.cork.router',
        'app.templates'
    ]);

    module.directive('appTags', [
        function appProject() {
            return {
                scope: {
                    tags: '=appTags'
                },
                restrict: 'A',
                templateUrl: 'components/tags/tags.tpl.html',
                controllerAs: 'tagList',
                controller: [
                    '$scope',
                    function appTagsCtrl($scope) {
                        var tags = this;
                    }
                ]
            };
        }
    ]);

    module.directive('appTag', [
        function appProject() {
            return {
                scope: {
                    tag: '=appTag',
                    onClick: '='
                },
                restrict: 'A',
                templateUrl: 'components/tags/tag.tpl.html',
                controllerAs: 'tagItem',
                controller: [
                    '$scope',
                    'corkRouter',
                    function appTagCtrl($scope, corkRouter) {
                        var tag = this;
                        $scope.router = corkRouter;
                    }
                ]
            };
        }
    ]);

})(angular);
