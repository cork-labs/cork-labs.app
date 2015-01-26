(function (angular) {
    'use strict';

    /**
     * @ngdoc module
     * @name az.router
     *
     * @description
     * Provides a azRouter registry and methods to configure and navigate routes in a consistent way.
     */
    var module = angular.module('az.router', [
        'ngRoute'
    ]);

    /**
     * @ngdoc service
     * @name azRouterProvider
     *
     * @description
     * Configures the {@link azRouter} service.
     */
    module.provider('azRouter', [
        '$routeProvider',
        function azRouterProvider($routeProvider) {

            /**
             * stores unique route objects
             */
            var routeMap = {};

            /**
             * Adds a route with $routeProvider and registers the route in the map.
             * @param {string} route  The route name.
             * @param {object} config The $routeProvider object, extended with `pattern` and optional `link`.
             */
            var addRoute = function (route, config) {

                if (!angular.isString(route) || !route.length) {
                    throw new Error('Invalid route name "' + route + '".');
                }

                if (routeMap[route]) {
                    throw new Error('Duplicate route "' + route + '".');
                }

                if (!angular.isObject(config)) {
                    throw new Error('Invalid config "' + config + '" in route "' + route + '".');
                }

                var options = angular.copy(config);

                if (!angular.isString(options.pattern) || !options.pattern.length) {
                    throw new Error('Invalid pattern "' + options.pattern + '" in route "' + route + '".');
                }

                // add name and location
                options.name = route;

                routeMap[route] = options;

                // register the route
                if (options.template || options.templateUrl || options.controller) {
                    $routeProvider.when(options.pattern, options);
                }
            };

            /**
             * Returns the route configuration.
             * @param {string}  route  The route name.
             * @param {object=} params The route params.
             */
            var getRoute = function (route) {
                if (!routeMap.hasOwnProperty(route)) {
                    throw new Error('Unknown route "' + route + '".');
                }
                return routeMap[route];
            };

            /**
             * Parser for the url, it builds the url with the parameters provided
             * @param {string}  route
             * @param {object=} params
             */
            var getURL = function (route, params) {

                var url = getRoute(route).pattern;
                var hasParam;
                var regexp;
                var replace;

                url = url.replace(/(\/)?:(\w+)(\?|\*)?/g, function (result, slash, key, flag) {
                    hasParam = params.hasOwnProperty(key);
                    // error on mandatory parameters
                    if (flag !== '?' && !hasParam) {
                        throw new Error('Missing parameter "' + key + '" when building URL for route "' + route + '".');
                    }
                    regexp = ':' + key;
                    // optional parameters
                    if (flag === '?') {
                        regexp += '\\?';
                        // replace preceeding / if optional parameter is not provided
                        if (!hasParam || !params[key]) {
                            regexp = '\/' + regexp;
                        }
                    }
                    // greedy parameters
                    else if (flag === '*') {
                        regexp += '\\*';
                    }
                    replace = (hasParam && params[key]) || '';
                    return result.replace(new RegExp(regexp), replace);
                });

                return url;
            };

            /**
             * @ngdoc method
             * @name azRouterProvider#addRoute
             *
             * @description
             * Registers the route in both angular `$routeProvider` and the {@link azRouterProvider} provider.
             *
             * @param {string} route  The route name.
             * @param {object} config The $routeProvider object, extended with `pattern` and optional `link`.
             */
            this.addRoute = addRoute;

            /**
             * @ngdoc method
             * @name azRouterProvider#getRoute
             *
             * @description
             * Returns the route configuration.
             *
             * @param {string}  route  The name of the route.
             */
            this.getRoute = getRoute;

            /**
             * @ngdoc method
             * @name azRouterProvider#getRoute
             *
             * @description
             * Returns the route configuration.
             *
             * @param {string}  route  The name of the route.
             * @param {object=} params The route params.
             */
            this.getURL = getURL;

            /**
             * @ngdoc service
             * @name azRouter
             *
             * @description
             * Provides methods to build route URLs and navigate.
             */
            this.$get = [
                '$rootScope',
                '$q',
                '$timeout',
                '$route',
                '$location',
                function azRouterFactory($rootScope, $q, $timeout, $route, $location) {

                    /**
                     * stores the current active interceptors
                     */
                    var interceptors = {};

                    /**
                     * parses
                     */
                    var parser = document.createElement('a');

                    /**
                     * Executed before a route change
                     * Rejects the route change if at least one of the registered interceptors returns something falsy. If at least
                     * one returns a promise wait for the promise(s) to resolve. Reject route change if at least one of them is rejected.
                     * @returns {array|boolean} an array of promises or boolean false if one of the interceptors return false.
                     */
                    function getLocationChangeInterception() {
                        var defer = $q.defer();
                        var name;
                        var ret;
                        var promises = [];

                        for (name in interceptors) {
                            // excute otherwise
                            ret = interceptors[name].callback();
                            // assume any returned object be a promise
                            if (angular.isObject(ret)) {
                                promises.push(ret);
                            }
                            // reject if return is not undefined but falsy
                            else if (!angular.isUndefined(ret) && !ret) {
                                return false;
                            }
                        }
                        return promises.length ? promises : true;
                    }

                    /**
                     * binds and unbinds the window.onbeforeunload depending on existing at least one interceptor with a static message
                     */
                    function updateOnCloseEvent() {
                        var name;
                        var messages = [];
                        for (name in interceptors) {
                            var message = interceptors[name].message;
                            if (angular.isString(message) && message.length) {
                                messages.push(' - ' + message);
                            }
                        }
                        if (messages.length) {
                            window.onbeforeunload = messages.join('\n');
                        } else {
                            window.onbeforeunload = undefined;
                        }
                    }

                    var azRouter = {

                        /**
                         * @ngdoc method
                         * @name azRouter#addRoute
                         *
                         * @description
                         * Registers the route in both angular `$routeProvider` and the {@link azRouterProvider} provider.
                         *
                         * @param {string}  route  The route name.
                         * @param {object=} params The route params.
                         */
                        addRoute: addRoute,

                        /**
                         * @ngdoc method
                         * @name azRouter#getRoute
                         *
                         * @description
                         * Returns the route configuration.
                         *
                         * @param {string}  route  The route name.
                         */
                        getRoute: getRoute,

                        /**
                         * @ngdoc method
                         * @name azRouter#getURL
                         *
                         * @description
                         * Builds the URL for a route, given the provided params.
                         *
                         * @param {string}  route  The name of the route.
                         * @param {object=} params The route params.
                         */
                        getURL: function (route, params) {
                            return getURL(route, params);
                        },

                        /**
                         * @ngdoc method
                         * @name azRouter#location
                         *
                         * @description
                         * Navigates to a route, given the provided params and
                         *
                         * @param {string}  route  The name of the route.
                         * @param {object=} params The route params.
                         */
                        location: function (route, params) {
                            return $location.url(getURL(route, params));
                        },

                        /**
                         * @ngdoc method
                         * @name azRouter#addInterceptor
                         *
                         * @description
                         * Registers a callback to be executed before route changes. Interceptors can accept or reject the
                         * route change by returning a boolean or a Promise that will accept/reject the route change.
                         *
                         * @param {string}   name     The name of the interceptor.
                         * @param {Function} params   The callback function.
                         * @param {string=}  message  An optional message to show on window close event. If at least one
                         *                              interceptor registers an non-empty message, the window.onbeforeunload
                         *                              event will be bound to display the existing messages to the user.
                         */
                        addInterceptor: function (name, callback, message) {
                            if (interceptors.hasOwnProperty(name)) {
                                throw new Error('Duplicate interceptor name "' + name + '".');
                            }
                            if (!angular.isFunction(callback)) {
                                throw new Error('Callback for interceptor "' + name + '" should be a function.');
                            }
                            interceptors[name] = {
                                callback: callback,
                                message: message
                            };
                            updateOnCloseEvent();
                        },

                        /**
                         * @ngdoc method
                         * @name azRouter#setInterceptorMessage
                         *
                         * @description
                         * Updates an interncep
                         *
                         * @param {string}  route    The name of the interceptor.
                         * @param {string=} message  An optional message to show on window close event. If at least one
                         *                              interceptor registers an non-empty message, the window.onbeforeunload
                         *                              event will be bound to display the existing messages to the user.
                         */
                        setInterceptorMessage: function (name, message) {
                            if (!interceptors.hasOwnProperty(name)) {
                                throw new Error('Unknown interceptor name "' + name + '".');
                            }
                            interceptors[name].message = message;
                            updateOnCloseEvent();
                        },

                        /**
                         * @ngdoc method
                         * @name azRouter#removeInterceptor
                         *
                         * @description
                         * Unregisters a route change callback.
                         *
                         * @param {string}  route  The name of the interceptor.
                         */
                        removeInterceptor: function (name) {
                            if (interceptors.hasOwnProperty(name)) {
                                delete interceptors[name];
                            }
                        }
                    };

                    // FUU https://github.com/angular/angular.js/issues/5094
                    $rootScope.$on('$locationChangeStart', function (event, next, current) {
                        if ($route.current) {
                            var ret = getLocationChangeInterception();
                            // cancel synchronously
                            if ('boolean' === typeof ret) {
                                if (!ret) {
                                    event.preventDefault();
                                }
                            }
                            // freeze
                            else {
                                $location.freeze();
                                $q.all(ret).then(function () {
                                    $location.commit();
                                }, function () {
                                    $location.rollback();
                                });
                            }
                        }
                    });

                    return azRouter;
                }
            ];

        }
    ]);

})(angular);

