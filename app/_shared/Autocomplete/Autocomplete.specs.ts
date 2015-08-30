module openmaths.specs {
    'use strict';

    interface IFakeAutocompleteScope extends ng.IScope {
        SearchCtr: {
            autocompleteData: IAutocompleteData;
        };
    }

    describe('Autocomplete', () => {
        beforeEach(angular.mock.module('openmaths'));

        let autocompleteData: IAutocompleteData = {
            a1: {id: 'a1', title: 'Hello World a1', uriFriendlyTitle: 'hello-world-a1', umiType: 'test'},
            f3: {id: 'f3', title: 'Hello World f3', uriFriendlyTitle: 'hello-world-f3', umiType: 'test'}
        };

        let $compile: ng.ICompileService;
        let element: ng.IAugmentedJQuery;
        let $rootScope;
        let $scope: IFakeAutocompleteScope;
        let $templateCache;

        beforeEach(inject((_$compile_: ng.ICompileService,
                           _$rootScope_: ng.IRootScopeService,
                           _$templateCache_: ng.ITemplateCacheService) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
            $scope = $rootScope.$new();

            $scope.SearchCtr = {
                autocompleteData: autocompleteData
            };

            $templateCache.put('app/_shared/Autocomplete/autocomplete.html', '<ul><li ng-repeat="tag in SearchCtr.autocompleteData">{{tag}}</li></ul>');

            element = angular.element('<autocomplete></autocomplete>');

            $compile(element)($scope);
            $scope.$digest();
        }));

        it('should replace the element with the appropriate content', () => {
            let li = element.find('li');

            expect(li.length).toEqual(2);
        });
    });
}