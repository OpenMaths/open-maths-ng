module openmaths.specs {
    'use strict';

    describe('OmBind model', () => {
        beforeEach(module('openmaths'));

        it('should have the directive constructor', () => {
           expect(openmaths.OmBindDirective.init).toBeDefined();
        });
    });
}