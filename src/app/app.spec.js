describe('app', function () {
    'use strict';

    describe('appCtrl', function () {

        beforeEach(module('app'));

        it('should pass a dummy test', inject(function () {
            expect(true).toBeTruthy();
        }));

    });
});
