module openmaths.specs {
    'use strict';

    describe('GlobalController', () => {
        beforeEach(angular.mock.module('openmaths'));

        let controller:openmaths.GlobalController;
        let $rootScope;
        let $state;
        let $templateCache:ng.ITemplateCacheService;
        let $window:IGlobalControllerWindow;

        let testStates = ['explore'];
        let testStatesWithUiConfig = ['explore'];

        // @TODO
        // Authentication to be removed after development

        beforeEach(inject((Authentication:openmaths.Authentication,
                           NotificationFactory:openmaths.NotificationFactory,
                           ModalFactory:openmaths.ModalFactory,
                           _$rootScope_:ng.IRootScopeService,
                           _$state_:ng.ui.IStateProvider,
                           _$templateCache_:ng.ITemplateCacheService,
                           _$window_:IGlobalControllerWindow) => {
            $state = _$state_;
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
            $window = _$window_;

            $templateCache.put('app/components/Explore/explore.html', '');


            controller = new openmaths.GlobalController(Authentication, NotificationFactory, ModalFactory, $rootScope, $state, $window);
        }));

        afterEach(() => {
            openmaths.SessionStorage.remove('omUser');
            openmaths.SessionStorage.remove('gApiInitialised');
        });

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });

        // TODO Buy Sam beer
        it('should have the uiConfig Object attached to each state', () => {
            _.forEach(testStatesWithUiConfig, (state) => {
                $state.go(state);
                $rootScope.$digest();

                let uiConfig:IUiConfig = controller.uiConfig;

                expect(uiConfig).toBeDefined();
            });
        });

        it('should assign correct state properties and add correct class on body when state changes', () => {
            _.forEach(testStates, (state) => {
                $state.go(state);
                $rootScope.$digest();

                let bodyClass:string = controller.bodyClass;


                expect(bodyClass).toEqual('page-explore');
            });
        });

        it('should have the correct staticUrl model attached to its scope', () => {
            expect(controller.staticUrl).toBe(openmaths.Config.getStaticUrl());
        });

        it('should make gApiInitialised true after window.gApiInitialised() has been called', () => {
            $window.gApiInitialised();

            expect(openmaths.SessionStorage.get('gApiInitialised')).toBe(true);
        });

        it('should have the signIn method attached to its scope', () => {
            expect(controller.signIn).toBeDefined();
        });

        it('should have the signIn method attached to its scope', () => {
            expect(controller.signOut).toBeDefined();
        });
    });
}