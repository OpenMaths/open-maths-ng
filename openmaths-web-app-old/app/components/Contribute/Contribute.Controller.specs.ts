module openmaths.specs {
    'use strict';

    describe('ContributeController', () => {
        beforeEach(angular.mock.module('openmaths'));

        let controller:openmaths.ContributeController;
        let $rootScope:ng.IRootScopeService;

        beforeEach(inject((NotificationFactory:openmaths.NotificationFactory,
                           _$rootScope_:ng.IScope,
                           $http:ng.IHttpService,
                           $state:ng.ui.IStateService) => {
            $rootScope = _$rootScope_;

            controller = new openmaths.ContributeController($rootScope.$new(), $http, NotificationFactory, $state);
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