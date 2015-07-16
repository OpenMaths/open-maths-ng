module openmaths.specs {
    'use strict';

    describe('ExploreController', () => {
        beforeEach(module('openmaths'));

        let controller: openmaths.ExploreController;
        let $rootScope: ng.IRootScopeService;
        let $state: ng.ui.IStateService;

        beforeEach(inject((Api: openmaths.Api,
                           _$rootScope_: ng.IRootScopeService,
                           _$state_: ng.ui.IStateService) => {
            $state = _$state_;
            $rootScope = _$rootScope_;

            controller = new openmaths.ExploreController(Api, $rootScope, $state);
        }));
    });
}