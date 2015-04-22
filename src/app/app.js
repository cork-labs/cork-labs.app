(function (angular) {
    'use strict';

    var module = angular.module('app', [
        'ng.cx.config',
        // app
        'app.services.cork-labs.api',
        'app.services.cork-labs.auth',
        'app.config',
        'app.controllers.home',
        'app.controllers.projects',
        'app.controllers.search',
        'app.controllers.about',
        'app.controllers.content', // must be last, has a catch all
        'app.components.search'
    ]);

    module.config([
        '$locationProvider',
        'cxConfigProvider',
        'configData',
        'corkAuthorizationProvider',
        'corkIdentityProvider',
        'corkLabsApiClientProvider',
        function appConfig($locationProvider, configProvider, configData, authorizationProvider, identityProvider, apiClientProvider) {

            // -- $location

            $locationProvider.html5Mode(true).hashPrefix('!');

            // -- config

            configProvider.merge(configData);

            // -- authorization

            authorizationProvider.configure({
                defaultRedirectPath: '/'
            });

            // -- api

            //apiClientProvider.configure({
            //    baseUrl: '/api'
            //});

        }
    ]);

    module.run([
        '$rootScope',
        '$location',
        '$window',
        function ($rootScope, $location, $window) {

        }
    ]);

    module.controller('appCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$location',
        '$window',
        '$timeout',
        'corkRouter',
        'corkIdentity',
        'corkLabsApiClient',
        function ($scope, $rootScope, $q, $location, $window, $timeout, router, identity, apiClient) {

            $scope.githubSignIn = function () {
                apiClient.service('authentication').oauth('github').then(function (res) {
                    $window.location.href = res.url;
                });

            };

            $scope.signOut = function () {
                apiClient.service('authentication').signOut().then(function (res) {
                    identity.clear();
                });

            };

            $rootScope.router = router;
        }
    ]);

})(angular);
