module openmaths.specs {
    'use strict';

    describe('ContributeController', () => {
        beforeEach(module('openmaths'));

        let controller: openmaths.ContributeController;

        beforeEach(inject(($rootScope: ng.IScope, $http: ng.IHttpService) => {
            controller = new openmaths.ContributeController($rootScope.$new(), $http);
        }));

        it('should create a new controller with MutationForm model attached to it', () => {
            expect(controller).toBeDefined();
            expect(controller.MutationForm).toBeDefined();
        });
    });
}