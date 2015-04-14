(function (angular) {
    'use strict';

    var module = angular.module('app.components.project-list', [
        'hc.marked',
        'app.components.tags',
        'app.components.project-assets',
        'app.templates'
    ]);

    module.directive('appProjectList', [
        function appProject() {
            return {
                scope: {
                    projects: '=appProjectList',
                    onClick: '='
                },
                restrict: 'A',
                templateUrl: 'components/project/list.tpl.html',
                controllerAs: 'projectList',
                controller: [
                    '$scope',
                    function appProjectListCtrl($scope) {
                        var projectList = this;
                    }
                ]
            };
        }
    ]);

})(angular);
