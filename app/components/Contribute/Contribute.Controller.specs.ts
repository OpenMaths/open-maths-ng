module openmaths.specs {
    'use strict';

    describe('ContributeController', () => {
        beforeEach(module('openmaths'));

        let controller: openmaths.ContributeController;

        beforeEach(() => {
            controller = new openmaths.ContributeController();
        });

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });
    });
}