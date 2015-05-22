module openmaths.specs {
    'use strict';

    describe('Autocomplete', () => {
        beforeEach(module('openmaths'));

        let $compile: ng.ICompileService;
        let $rootScope;
        let $scope: INotificationDirectiveScope;
        let $templateCache;

        let element: ng.IAugmentedJQuery;

        beforeEach(inject((_$compile_: ng.ICompileService,
                           _$rootScope_: ng.IRootScopeService,
                           _$templateCache_: ng.ITemplateCacheService) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
            $scope = $rootScope.$new();

            $templateCache.put('app/shared/Autocomplete/autocomplete.html', '');

            element = angular.element('<autocomplete></autocomplete>');

            $compile(element)($scope);
            $scope.$digest();
        }));
    });
}