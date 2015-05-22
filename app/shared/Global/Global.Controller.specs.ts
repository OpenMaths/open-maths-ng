module openmaths.specs {
    'use strict';

    describe('GlobalController', () => {
        beforeEach(module('openmaths'));

        let controller: openmaths.GlobalController;
        let $rootScope;
        let $state;
        let $templateCache: ng.ITemplateCacheService;
        let $window: IGlobalControllerWindow;

        beforeEach(inject((_$rootScope_: ng.IRootScopeService,
                           _$state_: ng.ui.IStateProvider,
                           _$templateCache_: ng.ITemplateCacheService,
                           _$window_: IGlobalControllerWindow) => {
            $state = _$state_;
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
            $window = _$window_;

            $templateCache.put('app/components/Home/home.html', '');
            $templateCache.put('app/components/Dive/dive.html', '');
            $templateCache.put('app/components/Dive/dive.list.html', '');

            controller = new openmaths.GlobalController($rootScope, $window);
        }));

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });

        it('should assign correct state properties and add correct class on body when state changes', () => {
            let states = ['home', 'dive', 'dive.list'];

            _.forEach(states, (state) => {
                $state.go(state);
                $rootScope.$digest();

                let newState: ng.ui.IState = $state.current,
                    newStates: Array<string> = newState.name.split('.'),
                    bodyClass: string = controller.bodyClass;

                expect(bodyClass).toEqual('page-' + _.first(newStates));
            });
        });

        it('should have a "false-y" gApiInitialised model attached to its scope', () => {
            expect(controller.gApiInitialised).toBe(false);
        });

        it('should make gApiInitialised true after window.gApiInitialised() has been called', () => {
            $window.gApiInitialised();

            expect(controller.gApiInitialised).toBe(true);
        });
    });
}