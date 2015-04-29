(function (angular) {
    'use strict';

    var module = angular.module('app.services.cork-labs.auth', [
        'ng.cork.api',
        'ng.cork.authorization',
        'ng.cork.identity'
    ]);

    module.run([
        '$rootScope',
        '$q',
        'corkRouter',
        'corkIdentity',
        'corkAuthorization',
        'corkLabsApiClient',
        function ($rootScope, $q, router, identity, authorization, apiClient) {

            // -- heatbeat

            // -- identity

            identity.setAcquireMethod(function () {
                return apiClient.service('authentication').me();
            });

            identity.acquire();

            $rootScope.$on('corkIdentity.onChange', function ($event, identity) {
                $rootScope.identity = identity;
                // if the user is still authorized in the current route
                authorization.$authorizeRoute().then(function () {
                    // forcefuly reload it to apply changes (not necessary if controllers are aware that permissions can change)
                }, function (error) {
                    // or broadcast the error change (will cause authorization service to redirect to path defined in the error, the route or config)
                    $rootScope.$broadcast('$routeChangeError', router.$route.current, router.$route.previous, error);
                });
            });

            $rootScope.$on('corkLabsApiClient.on401', function () {
                identity.clear();
            });

            // var authService = apiClient.service('authentication');
            // var heartbeatMethod = function () {
            //     return authService.heartbeat(2000).then(function (response) {
            //         return response;
            //     }, function (err) {
            //         if (err.status === 401) {
            //             identity.kill();
            //             console.log('you have been signed off');
            //             $location.path('/');
            //             return true;
            //         }
            //         if (error 500) {
            //             return $q.reject();
            //         }
            //     });
            // };

            // var heartbeat = new CorkHeartbeat(heartbeatMethod, {
            //     starting: {
            //         rate: 1000,
            //         repeat: 2
            //     },
            //     started: {
            //         rateStart: 15000,
            //     },
            //     suspending: {
            //         rate: 1000,
            //         repeat: 3
            //     },
            //     suspended: {
            //         rate: 4000,
            //         delta: function (retries, lastRate) {
            //             if (retries > 10) {
            //                 heartbeat.sleep();
            //             }
            //             return lastRate + lastRate * 2;
            //         }
            //     }
            // });

            // heartbeat.onStateChange(function (stateFrom, stateTo) {
            //     console.log('heartbeat state: ', stateFrom + '->' + stateTo);
            // });

            // heartbeat.onUpdateHealth(function (health) {
            //     console.log('heartbeat health:', health);
            // });

            // $rootScope.$on('corkIdentity.onInitialized', function (user) {
            //     console.log('identity initialized:', user);
            //     heartbeat.start();
            // });

            // heartbeat.onSuspended(function ($event, health) {
            //     console.log('you have lost your connection');
            // });

            // hearbeat.onStarted(function ($event, health) {
            //     console.log('connection is back');
            //     identity.confirm().then(function () {
            //         console.log('still the same user');
            //         $location.path('/home');
            //     }, function (newUser) {
            //         console.log('');
            //         identity.setUser(newUser);
            //     });
            // });

            // -- authorization middlewares

            authorization.middleware('isAnonymous', function () {
                return identity.ready.then(function () {
                    if (identity.current && identity.current.id) {
                        return $q.reject();
                    }
                });
            });

            authorization.middleware('isAuthenticated', function () {
                return identity.ready.then(function () {
                    if (!identity.current || !identity.current.id) {
                        return $q.reject();
                    }
                });
            });

            authorization.middleware('isAdmin', function () {
                return identity.ready.then(function () {
                    if (!identity.current || !identity.current.roles || identity.current.roles.indexOf('admin') === -1) {
                        return $q.reject();
                    }
                });
            });

            authorization.addAction('project.create', [authorization.middleware('isAdmin')]);
            authorization.addAction('project.edit', [authorization.middleware('isAdmin')]);
        }
    ]);

})(angular);
