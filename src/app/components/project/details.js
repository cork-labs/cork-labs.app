(function (angular) {
    'use strict';

    var module = angular.module('app.components.project-details', [
        'hc.marked',
        'app.components.tags',
        'app.components.project-assets',
        'app.templates'
    ]);

    module.directive('appProjectDetails', [
        function appProject() {
            return {
                scope: {
                    project: '=appProjectDetails',
                    onClick: '='
                },
                restrict: 'A',
                templateUrl: 'components/project/details.tpl.html',
                controllerAs: 'projectDetails',
                controller: [
                    '$scope',
                    function appProjectDetailsCtrl($scope) {
                        var projectDetails = this;

                        $scope.$watch('project', function (val) {
                            $scope.currentVersion = val && val.versions && val.versions[val.versions.length - 1];
                        });
                    }
                ]
            };
        }
    ]);

})(angular);
