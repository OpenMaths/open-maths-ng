module openmaths.specs {
    'use strict';

    describe('ModalDirective', () => {
        beforeEach(angular.mock.module('openmaths'));

        let $compile:ng.ICompileService;
        let $rootScope;
        let $scope:INotificationDirectiveScope;
        let $templateCache;

        let element:ng.IAugmentedJQuery;
        let ModalFactory:ModalFactory;

        beforeEach(inject((_$compile_:ng.ICompileService,
                           _$rootScope_:ng.IRootScopeService,
                           _$templateCache_:ng.ITemplateCacheService,
                           _ModalFactory_:ModalFactory) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
            $scope = $rootScope.$new();
            ModalFactory = _ModalFactory_;

            $templateCache.put('app/_shared/Modal/modal.html', '<div class="modal-backdrop" ng-class="{open: Modal.isOpen}"></div>');

            element = angular.element('<modal></modal>');

            $compile(element)($scope);
            $scope.$digest();
        }));

        it('should have "open" class on the root when generated', () => {
            ModalFactory.generate(new Modal(true, 'Hello World'));

            $compile(element)($scope);
            $scope.$digest();

            expect(element.hasClass('open')).toBe(true);
            // @TODO test heading / title
            //expect(element.html()).toEqual('Hello World');
        });
    });
}