(function (angular) {
    'use strict';

    var module = angular.module('app.services.cork-labs.api', [
        'ng.cork.api'
    ]);

    /**
     * @ngdoc object
     * @name app.services.cork-labs.api.corkLabsApiClientProvider
     *
     * @description
     * Allows the {@link app.services.cork-labs.api.corkLabsApiClient corkLabsApiClient} service to be configured.
     */
    module.provider('corkLabsApiClient', [
        function corkLabsApiClientProvider() {

            /**
             * @type {Object} service configuration.
             */
            var serviceConfig = {
                basePath: '/api'
            };

            /**
             * @ngdoc function
             * @name configure
             * @methodOf app.services.cork-labs.api.corkLabsApiClientProvider
             *
             * @description
             * Configures the {@link app.services.cork-labs.api.corkLabsApiClient corkLabsApiClient} service.
             *
             * @param {Object} config Object with configuration options, extends base configuration.
             * ```
             * {
             *     // window.onbeforeunload header. Default: "Warning:"
             *     dlgHeader: <STRING>,
             *     // window.onbeforeunload msg prefix. Default: " - "
             *     msgPrefix: <STRING>,
             *     // displayed when navigation is disabled but no
             *     // interceptors have set a message.
             *     // Default: "All changes not yet saved will be lost."
             *     defaultMsg: <STRING>
             * }
             * ```
             */
            this.configure = function (config) {
                angular.extend(serviceConfig, config);
            };

            /**
             * @ngdoc service
             * @name app.services.cork-labs.api.corkLabsApiClient
             *
             * @description
             * Provides a client for the cork-labs.bk api.
             */
            this.$get = [
                '$rootScope',
                '$q',
                'CorkApiClient',
                'CorkApiService',
                function CorkApiClientFactory($rootScope, $q, CorkApiClient, CorkApiService) {

                    var apiClient = new CorkApiClient({
                        baseUrl: serviceConfig.basePath
                    });

                    var middleware = apiClient.middleware;

                    middleware('normalizeResponse', function (req, res) {
                        return res.data.data;
                    });

                    middleware('broadcast401', function (req, err) {
                        if (err.status === 401) {
                            $rootScope.$broadcast('corkLabsApiClient.onUnauthenticated');
                        }
                    });

                    apiClient.service('search', function () {
                        return new CorkApiService({
                            execute: apiClient.execute,
                            all: {
                                success: [middleware('normalizeResponse')],
                                error: [middleware('broadcast401')]
                            },
                            methods: {
                                search: {
                                    verb: 'POST',
                                    url: '/search',
                                    args: function (req, terms) {
                                        req.set('data.terms', terms);
                                    }
                                }
                            }
                        });
                    });

                    apiClient.service('authentication', function () {
                        return new CorkApiService({
                            execute: apiClient.execute,
                            methods: {
                                me: {
                                    verb: 'GET',
                                    url: '/auth/me',
                                    success: [
                                        middleware('normalizeResponse'),
                                        function (res, user) {
                                            return user;
                                        }
                                    ],
                                    error: [function (res, err) {
                                        if (err.status === 401) {
                                            return {
                                                id: 'anon',
                                                name: 'Anonymous'
                                            };
                                        }
                                    }]
                                },
                                oauth: {
                                    verb: 'POST',
                                    pattern: '/oauth/:provider/sign-in',
                                    args: function (req, provider) {
                                        req.set('urlParams.provider', provider);
                                    },
                                    success: [
                                        middleware('normalizeResponse'),
                                        function (res, user) {
                                            return user;
                                        }
                                    ],
                                    error: [function (res, err) {
                                        if (err.status === 401) {
                                            return {
                                                id: 'anon',
                                                name: 'Anonymous'
                                            };
                                        }
                                    }]
                                },
                                heartbeat: {
                                    verb: 'GET',
                                    url: '/auth/heartbeat',
                                    error: [middleware('broadcast401')]
                                },
                                signOut: {
                                    verb: 'POST',
                                    url: '/auth/sign-out',
                                    error: [middleware('broadcast401')]
                                }
                            }
                        });
                    });

                    apiClient.service('projects', function () {
                        return new CorkApiService({
                            execute: apiClient.execute,
                            all: {
                                success: [middleware('normalizeResponse')],
                                error: [middleware('broadcast401')]
                            },
                            methods: {
                                create: {
                                    verb: 'POST',
                                    pattern: '/project',
                                    args: function (req, project) {
                                        req.data = project;
                                    }
                                },
                                update: {
                                    verb: 'PUT',
                                    pattern: '/project/:id',
                                    args: function (req, project) {
                                        req.set('urlParams.id', project.id);
                                        req.data = project;
                                    }
                                },
                                build: {
                                    verb: 'POST',
                                    pattern: '/project/:id/build',
                                    args: function (req, project, tag) {
                                        req.set('urlParams.id', project.id);
                                        req.data = {
                                            tag: tag
                                        };
                                    }
                                },
                                setCurrentVersion: {
                                    verb: 'POST',
                                    pattern: '/project/:id/current-version',
                                    args: function (req, project, tag) {
                                        req.set('urlParams.id', project.id);
                                        req.data = {
                                            tag: tag
                                        };
                                    }
                                },
                                list: {
                                    verb: 'GET',
                                    url: '/project'
                                },
                                search: {
                                    verb: 'POST',
                                    url: '/project/search',
                                    args: function (req, terms, tags) {
                                        req.set('data.terms', terms);
                                        req.set('data.tags', tags);
                                    }
                                },
                                get: {
                                    verb: 'GET',
                                    pattern: '/project/:id',
                                    args: function (req, id) {
                                        req.set('urlParams.id', id);
                                    }
                                }
                            }
                        });
                    });

                    apiClient.service('tags', function () {
                        return new CorkApiService({
                            execute: apiClient.execute,
                            all: {
                                success: [middleware('normalizeResponse')],
                                error: [middleware('broadcast401')]
                            },
                            methods: {
                                create: {
                                    verb: 'POST',
                                    pattern: '/tag',
                                    args: function (req, tag) {
                                        req.data = tag;
                                    }
                                },
                                list: {
                                    verb: 'GET',
                                    url: '/tag'
                                },
                                search: {
                                    verb: 'POST',
                                    url: '/tag/search',
                                    args: function (req, terms) {
                                        req.set('data.terms', terms);
                                    },
                                    request: [function (req) {
                                        if (!req.get('data.terms')) {
                                            return [];
                                        }
                                    }]
                                },
                                get: {
                                    verb: 'GET',
                                    pattern: '/tag/:id',
                                    args: function (req, id) {
                                        req.set('urlParams.id', id);
                                    }
                                },
                                getByName: {
                                    verb: 'GET',
                                    pattern: '/tag/-by-name/:name',
                                    args: function (req, name) {
                                        req.set('urlParams.name', name);
                                    }
                                }
                            }
                        });
                    });

                    return apiClient;
                }
            ];
        }
    ]);

})(angular);
