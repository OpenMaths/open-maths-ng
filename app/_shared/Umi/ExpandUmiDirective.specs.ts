module openmaths.specs {
    'use strict';

    describe('ExpandUmiDirective model', () => {
        beforeEach(module('openmaths'));

        it('should have the directive constructor', () => {
            expect(openmaths.ExpandUmiDirective.init).toBeDefined();
        });
    });
}