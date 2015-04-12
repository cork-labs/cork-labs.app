(function (angular) {
    'use strict';

    var module = angular.module('app.components.project-assets', [
        'ng.cx.config',
        'ng.cork.ui.focus-on',
        'app.templates'
    ]);

    var assetPriority = ['repo', 'demo', 'docs', 'coverage', 'travis'];

    var assetIcons = {
        repo: 'github',
        demo: 'play-circle',
        docs: 'lightbulb-o',
        coverage: 'heartbeat',
        travis: 'cubes',
    };

    function prioritizeAssets(assets, all) {
        var ret = [];
        var name;
        var asset;
        for (var ix = 0; ix < assetPriority.length; ix++) {
            name = assetPriority[ix];
            if ((asset = assets[name]) && (all || assets[name].enabled)) {
                ret.push({
                    enabled: asset.enabled,
                    name: name,
                    icon: assetIcons[name] || 'times',
                    url: asset.url
                });
            }
        }
        return ret;
    }

    function interpolateAssetUrl(config, project, name, version) {
        switch (name) {
        case 'repo':
            return 'https://github.com/' + config.get('project.githubUser') + '/' + project.id;
        case 'travis':
            return 'https://travis-ci.org/' + config.get('project.travisUser') + '/' + project.id;
        case 'demo':
            return config.get('project.baseUrl') + '/' + project.id + '/' + version + '/docs/#/demos';
        default:
            return config.get('project.baseUrl') + '/' + project.id + '/' + version + '/' + name;
        }
    }

    function getAssetUrl(config, project, name) {
        return interpolateAssetUrl(config, project, name, 'current');
    }

    var isAssetUrlDefault = function (config, project, name) {
        var url;

        if (project && project.assets && project.assets[name] && project.assets[name].enabled) {
            url = project.assets[name].url;
        }

        var res = !url || url === interpolateAssetUrl(config, project, name, 'current');
        return res;
    };

    module.directive('appProjectAssets', [
        function appProject() {
            return {
                scope: {
                    project: '=appProjectAssets'
                },
                restrict: 'A',
                templateUrl: 'components/project/assets.tpl.html',
                controllerAs: 'projectAssets',
                controller: [
                    '$scope',
                    function appProjectAssetsCtrl($scope) {
                        var projectAssets = this;

                        $scope.assets = [];

                        $scope.$watch('project.assets', function (val) {
                            val = val || {};
                            $scope.assets = prioritizeAssets(val);
                        }, true);
                    }
                ]
            };
        }
    ]);

    module.directive('appProjectAssetsEdit', [
        function appProject() {
            return {
                scope: {
                    project: '=appProjectAssetsEdit'
                },
                restrict: 'A',
                templateUrl: 'components/project/assets-edit.tpl.html',
                controllerAs: 'projectAssetsEdit',
                controller: [
                    '$scope',
                    function appProjectAssetsEditCtrl($scope) {
                        var projectAssetsEdit = this;

                        $scope.assets = assetPriority;
                        $scope.icons = assetIcons;
                    }
                ]
            };
        }
    ]);

    module.directive('appProjectAssetEdit', [
        'cxConfig',
        function appProject(cxConfig) {
            return {
                scope: {
                    asset: '=appProjectAssetEdit',
                    name: '=appAssetName',
                    project: '=appProject'
                },
                restrict: 'A',
                templateUrl: 'components/project/asset-edit.tpl.html',
                controllerAs: 'projectAssetEdit',
                controller: [
                    '$scope',
                    function appProjectAssetEditCtrl($scope) {
                        var projectAssetEdit = this;

                        $scope.onClickDefaultUrl = function () {
                            $scope.isFocused = true;
                            if (isAssetUrlDefault($scope.project, $scope.name)) {
                                $scope.project.assets[$scope.name].url = $scope.defaultUrl;
                            }
                            $scope.$broadcast('app-project-asset-edit.focus-input');
                        };

                        $scope.onInputFocus = function () {
                            $scope.isFocused = true;
                        };

                        $scope.onInputBlur = function () {
                            $scope.isFocused = false;
                        };

                        $scope.$watch('asset.url', function () {
                            if ($scope.project) {
                                $scope.defaultUrl = interpolateAssetUrl(cxConfig, $scope.project, $scope.name, 'current');
                                $scope.currentUrl = getAssetUrl(cxConfig, $scope.project, $scope.name);
                                $scope.isDefault = isAssetUrlDefault(cxConfig, $scope.project, $scope.name);
                            }
                        });
                    }
                ]
            };
        }
    ]);

})(angular);
