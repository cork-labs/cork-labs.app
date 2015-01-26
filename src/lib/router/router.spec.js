describe('az.router', function () {
    'use strict';

    beforeEach(module('az.router'));

    describe('provider', function () {

        describe('addRoute()', function () {

            var azRouterProvider;
            beforeEach(module(function (_azRouterProvider_) {
                azRouterProvider = _azRouterProvider_;
            }));

            // kickstart the injector http://stackoverflow.com/questions/15391683/how-can-i-test-a-angularjs-provider
            beforeEach(inject(function ($route) {}));

            it('should throw an error if name is missing.', function () {
                expect(function () {
                    azRouterProvider.addRoute();
                }).toThrow('Invalid route name "undefined".');
            });

            it('should throw an error if name is invalid.', function () {
                var route = {};
                expect(function () {
                    azRouterProvider.addRoute(route);
                }).toThrow('Invalid route name "' + route + '".');
            });

            it('should throw an error if route has a repeated name.', function () {
                var route = 'list';
                expect(function () {
                    azRouterProvider.addRoute(route, {
                        pattern: '/foo'
                    });
                    azRouterProvider.addRoute(route);
                }).toThrow('Duplicate route "' + route + '".');
            });

            it('should throw an error if config is invalid.', function () {
                var route = 'foo';
                var config = 'bar';
                expect(function () {
                    azRouterProvider.addRoute(route, config);
                }).toThrow('Invalid config "' + config + '" in route "' + route + '".');
            });

            it('should throw an error if pattern is missing.', function () {
                var route = 'foo';
                var pattern;
                expect(function () {
                    azRouterProvider.addRoute(route, {});
                }).toThrow('Invalid pattern "' + pattern + '" in route "' + route + '".');
            });

            it('should throw an error if pattern is invalid.', function () {
                var route = 'foo';
                var pattern = {};
                expect(function () {
                    azRouterProvider.addRoute(route, {
                        pattern: pattern
                    });
                }).toThrow('Invalid pattern "' + pattern + '" in route "' + route + '".');
            });
        });

        // not covered because couldn't find a way to override the $routeProvider instance that the injector yields
        // basically, azRouteProvider is instantiated, and injected with the real $routeProvider, before we get a
        // chance to setup the injector
        describe('$routeProvider.when()', function () {

            var azRouterProvider;
            var $mockRouteProvider;
            beforeEach(module(function ($provide) {
                // mock $routeProviderMock
                $mockRouteProvider = jasmine.createSpyObj('$RouteProvider', ['when', '$get']);
                $provide.provider('$routeProvider', $mockRouteProvider);
            }));
            beforeEach(module(function (_azRouterProvider_) {
                azRouterProvider = _azRouterProvider_;
            }));

            // kickstart the injector http://stackoverflow.com/questions/15391683/how-can-i-test-a-angularjs-provider
            beforeEach(inject(function ($route) {}));

            it('should be invoked if route contains "template" property.', function () {
                var route = 'foo1';
                var config = {
                    pattern: 'bar',
                    template: 'baz'
                };
                var expected = {
                    pattern: 'bar',
                    template: 'baz'
                };
                azRouterProvider.addRoute(route, config);
                //expect($mockRouteProvider.when).toHaveBeenCalledWith(expected);
            });
        });

        describe('getRoute()', function () {

            var azRouterProvider;
            beforeEach(module(function (_azRouterProvider_) {
                azRouterProvider = _azRouterProvider_;
            }));

            // kickstart the injector http://stackoverflow.com/questions/15391683/how-can-i-test-a-angularjs-provider
            beforeEach(inject(function ($route) {}));

            it('should throw an error if route is unknown.', function () {
                var route = 'foobar';
                expect(function () {
                    azRouterProvider.getRoute(route);
                }).toThrow('Unknown route "' + route + '".');
            });

            it('should return the provided config object (a copy).', function () {
                var route = 'foo';
                var config = {
                    pattern: 'foobar'
                };
                var expected = {
                    name: route,
                    pattern: 'foobar'
                };

                azRouterProvider.addRoute(route, config);

                var obj = azRouterProvider.getRoute(route);
                expect(obj).not.toBe(config);
                expect(typeof obj).toBe('object');
                expect(obj.name).toEqual(expected.name);
                expect(obj.pattern).toEqual(expected.pattern);
            });
        });
    });

    describe('service', function () {

        var azRouterProvider;
        beforeEach(module(function (_azRouterProvider_) {
            var azRouterProvider = _azRouterProvider_;
            azRouterProvider.addRoute('foo', {
                pattern: '/bar'
            });

            azRouterProvider.addRoute('bar', {
                pattern: '/qux/:quux'
            });

            azRouterProvider.addRoute('baz', {
                pattern: '/qux/:quux?/quuux'
            });

            azRouterProvider.addRoute('qux', {
                pattern: '/qux/:quux*/quuux'
            });
        }));

        describe('getRoute()', function () {

            it('should throw an error if route is unknown.', inject(function (azRouter) {
                var route = 'foobar';
                expect(function () {
                    azRouter.getRoute(route);
                }).toThrow('Unknown route "' + route + '".');
            }));

            it('should return the route config.', inject(function (azRouter) {
                var route = 'bar';
                var expected = {
                    name: 'bar',
                    pattern: '/qux/:quux'
                };
                var obj = azRouter.getRoute(route);
                expect(typeof obj).toBe('object');
                expect(obj.name).toEqual(expected.name);
                expect(obj.pattern).toEqual(expected.pattern);
            }));
        });

        describe('getURL()', function () {

            it('should throw an error if route is unknown.', inject(function (azRouter) {
                var route = 'foobar';
                expect(function () {
                    azRouter.getURL(route);
                }).toThrow('Unknown route "' + route + '".');
            }));

            it('should return the URL location, when no parameters are required.', inject(function (azRouter) {
                var url = azRouter.getURL('foo');
                expect(url).toBe('/bar');
            }));

            it('should build the URL location, given the required parameters.', inject(function (azRouter) {
                var url = azRouter.getURL('bar', {
                    quux: 'corge'
                });
                expect(url).toBe('/qux/corge');
            }));

            it('should throw an error if a required parameter is missing. ', inject(function (azRouter) {
                var route = 'bar';
                var key = 'quux';
                expect(function () {
                    azRouter.getURL(route, {});
                }).toThrow('Missing parameter "' + key + '" when building URL for route "' + route + '".');
            }));

            it('should NOT throw an error if an optional parameter is missing. ', inject(function (azRouter) {
                var url = azRouter.getURL('baz', {});
                expect(url).toBe('/qux/quuux');
            }));

            it('should also replace symbol for greedy parameters. ', inject(function (azRouter) {
                var url = azRouter.getURL('qux', {
                    quux: 'corge'
                });
                expect(url).toBe('/qux/corge/quuux');
            }));
        });

        describe('location()', function () {

            // mock $location
            var $locationMock;
            beforeEach(module(function ($provide) {
                $locationMock = jasmine.createSpyObj('location', ['url']);
                $provide.value('$location', $locationMock);
            }));

            it('should throw an error if route is unknown.', inject(function (azRouter) {
                var route = 'foobar';
                expect(function () {
                    azRouter.location(route);
                }).toThrow('Unknown route "' + route + '".');
            }));

            it('should invoke "$location.url()" with the URL location, when no parameters are required.', inject(function (azRouter) {
                azRouter.location('foo');
                expect($locationMock.url).toHaveBeenCalledWith('/bar');
            }));

            it('should invoke "$location.url()" with the built URL location, given the required parameters.', inject(function (azRouter) {
                azRouter.location('bar', {
                    quux: 'corge'
                });
                expect($locationMock.url).toHaveBeenCalledWith('/qux/corge');
            }));

            it('should throw an error if a required parameter is missing. ', inject(function (azRouter) {
                var route = 'bar';
                var key = 'quux';
                expect(function () {
                    azRouter.location(route, {});
                }).toThrow('Missing parameter "' + key + '" when building URL for route "' + route + '".');
            }));

        });
    });

});

