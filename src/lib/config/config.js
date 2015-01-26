(function (angular) {
    'use strict';

    /**
     * @ngdoc module
     * @name az.config
     *
     * @description
     * Provides a simple way to configure, load and access config settings across a app.
     */

    var module = angular.module('az.config', [
        'ngLodash'
    ]);

    /**
     * @ngdoc service
     * @name azConfigProvider
     *
     * @description
     * Can be used to `set()` configuration synchronously in the `config()` phase of the application. Also provides a
     * `get()` and a `reset()` method.
     *
     * See also the {@link azConfig} service. It allows loading furhter data from remote URLs and allows
     * interaction with azConfig data during the execution of the application.
     */
    module.provider('azConfig', [
        'lodash',
        function azConfigProvider(lodash) {

            var pendingRequests = [];
            var data = {};

            /**
             * @ngdoc method
             * @name azConfigProvider#set
             *
             * @description
             * Sets a config value or extends config with provided data.
             *
             * @param {string} path  The "dot separated" path to set. Ex: `'foo.bar'`.
             * @param {*}      value The config value to store in the given path.
             *
             * @returns {*} The config value if it exists, `null` if not.
             */
            var set = function (path, value) {
                var steps;
                var step = data;
                var key;

                if (angular.isString(path)) {

                    steps = path.split('.');
                    while (steps.length > 1 && step) {
                        key = steps.shift();
                        if (!step.hasOwnProperty(key) || typeof step[key] !== 'object') {
                            step[key] = {};
                        }

                        step = step[key];
                    }

                    key = steps.shift();
                    step[key] = value;
                } else {
                    throw new Error('Invalid argument "path". Should be "string", was "' + (typeof path) + '".');
                }
            };

            /**
             * @ngdoc method
             * @name azConfigProvider#get
             *
             * @description
             * Returns the current config value for the given config path.
             *
             * @param {string} path The config path separated by dots. Ex: `'foo.bar'`.
             *
             * @returns {*} The config value if it exists, `null` if not.
             */
            var get = function (path) {
                var steps;
                var step = data;
                var key;

                if (angular.isUndefined(path) || angular.isString(path)) {

                    steps = path ? path.split('.') : [];
                    while (steps.length && step) {
                        key = steps.shift();
                        step = step.hasOwnProperty(key) ? step[key] : null;
                    }
                } else {
                    throw new Error('Invalid argument "path". Should be "undefined" or "string", was "' + (typeof path) + '".');
                }

                return step;
            };

            /**
             * @ngdoc method
             * @name azConfigProvider#merge
             *
             * @description
             * Extends config with provided data.
             *
             * @param {Object} obj The config data to merge into the existing data.
             */
            var merge = function (obj) {
                lodash.merge(data, obj);
            };

            /**
             * @ngdoc method
             * @name azConfigProvider#reset
             *
             * @description
             * Empties current config.
             */
            var reset = function () {
                data = {};
            };

            // -- API

            this.set = set;
            this.get = get;
            this.merge = merge;
            this.reset = reset;

            /**
             * @ngdoc service
             * @name azConfig
             *
             * @description
             * Configuration service, provides an interface to read and write config values as well as loading them from
             * remote URLs.
             *
             * See also the {@link azConfigProvider} which allows you to interact with config data during the `config` phase
             * of the application.
             */
            this.$get = [
                '$q',
                '$http',
                function azConfigFactory($q, $http) {

                    /**
                     * @ngdoc method
                     * @name azConfig#load
                     *
                     * @description
                     * Loads data from a remote URL and merges it with current configuration. Ex:
                     *
                     *     config.load('/foo.json', 'foo.bar').then(function(response) {
                     *         // response.data contains only the data loaded in this particular load() request
                     *         config.get('foo.bar');
                     *     })
                     *
                     * @param {string}  url  The URL of the JSON file to load.
                     * @param {string=} path An optional path to load this config data into. Ex: `foo.bar`
                     *
                     * @returns {Promise} A promise which is resolved with the response when the file is loaded. Please note
                     *    that the value passed to the promise is the whole response object.
                     */
                    function load(url, path) {
                        var promise = $http({
                            method: 'get',
                            url: url
                        }).then(function (response) {
                            if (angular.isString(path)) {
                                set(path, response.data);
                            } else {
                                merge(response.data);
                            }
                            return response;
                        });

                        pendingRequests.push(promise);

                        return promise;
                    }

                    /**
                     * @ngdoc method
                     * @name azConfig#set
                     *Sets a config value or extends config with provided data.
                     *
                     * @param {string} path  The "dot separated" path to set. Ex: `'foo.bar'`.
                     * @param {*}      value The config value to store in the given path.
                     *
                     * @returns {*} The config value if it exists, `null` if not.
                     */

                    /**
                     * @ngdoc method
                     * @name azConfig#get
                     *
                     * @description
                     * Returns the current config value for the given config path.
                     *
                     * @param {string} path The config path separated by dots. Ex: `'foo.bar'`.
                     *
                     * @returns {*} The config value if it exists, `null` if not.
                     */

                    // -- API

                    var azConfig = {
                        load: load,
                        set: set,
                        get: get
                    };

                    /**
                     * @ngdoc property
                     * @name pending
                     *
                     * @description
                     * Array containing all the **current** pending requests. Use `$q.all` to act when the current requests
                     * are completed. Ex:
                     *
                     *     $q.all(config.pending).then(function() {
                     *         // done
                     *     })
                     */
                    Object.defineProperty(azConfig, 'pending', {
                        get: function () {
                            return pendingRequests;
                        }
                    });

                    return azConfig;
                }
            ];
        }
    ]);

})(angular);

