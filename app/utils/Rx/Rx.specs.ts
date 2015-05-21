module openmaths.specs {
    'use strict';

    describe('ReactiveX', () => {
        it('should have the watchModel method', () => {
            let watchModel = openmaths.ReactiveX.watchModel;

            expect(watchModel).toBeDefined();
        });
    });
}