module openmaths.specs {
    'use strict';

    describe('ContributeController', () => {
        beforeEach(module('openmaths'));

        let controller: openmaths.ContributeController;
        let $rootScope: ng.IRootScopeService;

        beforeEach(inject((_$rootScope_: ng.IScope,
                           $http: ng.IHttpService) => {
            $rootScope = _$rootScope_;

            controller = new openmaths.ContributeController($rootScope.$new(), $http);
        }));

        it('should create a new controller with MutationForm model attached to it', () => {
            expect(controller).toBeDefined();
            expect(controller.MutationForm).toBeDefined();
        });

        it('should have a false-y parsingInProgress model attached to its scope', () => {
           expect(controller.parsingInProgress).toEqual(false);
        });
    });
}