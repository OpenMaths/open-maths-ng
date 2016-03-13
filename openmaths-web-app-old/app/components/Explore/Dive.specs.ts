module openmaths.specs {
    'use strict';

    describe('Dive model', () => {
        let model = new openmaths.Dive();

        it('should have the correct state set', () => {
            expect(model.state).toEqual('explore');
        });
    });
}