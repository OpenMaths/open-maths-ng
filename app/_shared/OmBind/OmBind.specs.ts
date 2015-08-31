module openmaths.specs {
    'use strict';

    describe('OmBind directive', () => {
        it('should have the directive constructor', () => {
           expect(openmaths.OmBindDirective.init).toBeDefined();
        });
    });
}