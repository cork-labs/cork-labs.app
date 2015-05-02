(function (angular) {
    'use strict';

    var module = angular.module('app.components.spinner', [
        'app.templates'
    ]);

    module.directive('appSpinner', [
        function appSpinner() {
            return {
                scope: {
                    enabled: '=appSpinner'
                },
                restrict: 'A',
                templateUrl: 'components/spinner/spinner.tpl.html',
                controllerAs: 'spinner',
                controller: [
                    '$scope',
                    function appSpinnerCtrl($scope) {
                        var tags = this;

                        $scope.$watch('enabled', function (val) {});
                    }
                ]
            };
        }
    ]);

})(angular);
