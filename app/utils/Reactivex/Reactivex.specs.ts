module openmaths.specs {
    'use strict';

    describe('ReactiveX', () => {
        it('should have the watchModel method', () => {
            expect(openmaths.ReactiveX.watchModel).toBeDefined();
        });
    });
}