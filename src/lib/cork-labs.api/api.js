(function (angular) {
    'use strict';

    var module = angular.module('cork-labs.api', [
        'ng.cork.api'
    ]);

    module.service('corkLabsApiClient', [
        '$q',
        '$http',
        'CorkApiClient',
        'CorkApiService',
        function CorkApiClientFactory($q, $http, CorkApiClient, CorkApiService) {

            var apiClient = new CorkApiClient({
                baseUrl: '/api'
            });

            apiClient.middleware('normalizeResponse', function (req, res) {
                return res.data.data;
            });

            apiClient.service('search', function () {
                return new CorkApiService({
                    execute: apiClient.execute,
                    all: {
                        success: [apiClient.middleware('normalizeResponse')]
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

            apiClient.service('projects', function () {
                return new CorkApiService({
                    execute: apiClient.execute,
                    all: {
                        success: [apiClient.middleware('normalizeResponse')]
                    },
                    methods: {
                        create: {
                            verb: 'POST',
                            pattern: '/tag',
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
                        success: [apiClient.middleware('normalizeResponse')]
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
                            }
                        },
                        get: {
                            verb: 'GET',
                            pattern: '/tag/:id',
                            args: function (req, id) {
                                req.set('urlParams.id', id);
                            }
                        }
                    }
                });
            });

            return apiClient;
        }
    ]);

})(angular);
