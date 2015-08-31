module openmaths.specs {
    'use strict';

    describe('NavigationDirective', () => {
        beforeEach(angular.mock.module('openmaths'));

        let $compile: ng.ICompileService;
        let $rootScope;
        let $scope: INotificationDirectiveScope;
        let $templateCache;

        let element: ng.IAugmentedJQuery;
        let NavigationFactory: openmaths.NavigationFactory;

        beforeEach(inject((_$compile_: ng.ICompileService,
                           _$rootScope_: ng.IRootScopeService,
                           _$templateCache_: ng.ITemplateCacheService,
                           _NavigationFactory_: openmaths.NavigationFactory) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
            NavigationFactory = _NavigationFactory_;
            $scope = $rootScope.$new();

            $templateCache.put('app/_shared/Navigation/navigation.html', '');

            element = angular.element('<navigation></navigation>');

            $compile(element)($scope);
            $scope.$digest();
        }));
    });
}