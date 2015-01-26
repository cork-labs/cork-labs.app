describe('az.config', function () {
    'use strict';

    beforeEach(module('az.config'));

    describe('provider', function () {

        // helper variable for testing agument validation
        var dataTypes;
        beforeEach(function () {
            dataTypes = {
                'string': Math.random().toString(36),
                'null': null,
                'undefined': undefined,
                'integer': Math.round(Math.random()),
                'double': Math.random(),
                'boolean': false,
                'function': function () {},
                'object': {
                    someAttribute: 'someValue'
                }
            };
        });

        var azConfigProvider;
        beforeEach(module(function (_azConfigProvider_) {
            azConfigProvider = _azConfigProvider_;
        }));

        describe('get()', function () {

            // kickstart the injector http://stackoverflow.com/questions/15391683/how-can-i-test-a-angularjs-provider
            it('', inject(function () {}));

            it('should throw an error if "path" argument is of an invalid type.', function () {

                var setInvalidData = function (data) {
                    return function () {
                        azConfigProvider.get(data);
                    };
                };

                delete dataTypes['undefined'];
                delete dataTypes['string'];
                for (var key in dataTypes) {
                    var expectedError = 'Invalid argument "path". Should be "undefined" or "string", was "' + (typeof dataTypes[key]) + '".';
                    expect(setInvalidData(dataTypes[key])).toThrow(expectedError);
                }
            });

            it('should retrieve all the existing data if no path provided.', function () {

                var data = {
                    foo: {
                        bar: 42
                    },
                    baz: 99
                };
                azConfigProvider.merge(data);

                var expected = angular.copy(data);
                expect(azConfigProvider.get()).toEqual(expected);
            });

            it('should retrieve existing data by path.', function () {

                var data = {
                    foo: {
                        bar: 42
                    }
                };
                azConfigProvider.merge(data);

                expect(azConfigProvider.get('foo.bar')).toBe(42);
            });

            it('should return "null" if requested data is not defined.', function () {

                azConfigProvider.set('foo.bar', 42);

                expect(azConfigProvider.get('qux')).toBeNull();
                expect(azConfigProvider.get('foo.bar.baz')).toBeNull();

            });
        });

        describe('set()', function () {

            // kickstart the injector http://stackoverflow.com/questions/15391683/how-can-i-test-a-angularjs-provider
            it('', inject(function () {}));

            it('should throw an error if "path" argument is of an invalid type.', function () {

                var setInvalidData = function (data) {
                    return function () {
                        azConfigProvider.set(data);
                    };
                };

                delete dataTypes['string'];
                for (var key in dataTypes) {
                    var expectedError = 'Invalid argument "path". Should be "string", was "' + (typeof dataTypes[key]) + '".';
                    expect(setInvalidData(dataTypes[key])).toThrow(expectedError);
                }
            });

            it('should store the provided data.', function () {

                var data = {
                    foo: {}
                };
                azConfigProvider.merge(data);
                azConfigProvider.set('foo.bar', 42);

                expect(azConfigProvider.get('foo.bar')).toBe(42);
            });

            it('should override existing objects with scalars.', function () {

                var data = {
                    foo: {
                        bar: 42
                    }
                };
                azConfigProvider.merge(data);
                azConfigProvider.set('foo', 42);

                expect(azConfigProvider.get('foo')).toBe(42);
                expect(azConfigProvider.get('foo.bar')).toBeNull();
            });

            it('should override existing scalars with objects.', function () {

                var data = {
                    foo: 42
                };
                azConfigProvider.merge(data);
                azConfigProvider.set('foo.bar', 42);

                expect(azConfigProvider.get('foo.bar')).toBe(42);
            });
        });

        describe('merge()', function () {

            it('should override existing data with provided data.', function () {

                var data = {
                    foo: {
                        bar: 42,
                        baz: 99
                    }
                };
                azConfigProvider.merge(data);

                var moreData = {
                    foo: {
                        baz: {
                            qux: 123
                        }
                    },
                    quux: 'corge'
                };
                azConfigProvider.merge(moreData);

                expect(azConfigProvider.get('foo.bar')).toBe(42);
                expect(azConfigProvider.get('foo.baz.qux')).toBe(123);
                expect(azConfigProvider.get('quux')).toBe('corge');
            });
        });

    });

});

