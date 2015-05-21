module openmaths.specs {
    'use strict';

    describe('SearchController', () => {
        beforeEach(module('openmaths'));

        let Api;
        let controller: openmaths.SearchController;
        let $httpBackend;
        let $rootScope: ng.IRootScopeService;
        let searchResult: ISearchResults;

        beforeEach(inject((_Api_: openmaths.Api,
                           _$httpBackend_: ng.IHttpBackendService,
                           _$rootScope_: ng.IRootScopeService) => {
            Api = _Api_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;

            controller = new openmaths.SearchController(Api, $rootScope.$new());
            searchResult = {
                selected: 2,
                data: [{}, {}, {}, {}, {}]
            };
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });

        it('should have a trigger method attached to its scope', () => {
            expect(controller.trigger).toBeDefined();
        });

        it('should be able to return a search promise', () => {
            // @TODO
            // abstract the response into magic var
            $httpBackend.expectGET('http://api.om.dev/search/hello').respond(200, {});

            let promise = controller.searchPromise('hello');

            promise.then((result) => {
                // @TODO
                // abstract the response into magic var
                expect(result.data).toEqual({});
            });

            $httpBackend.flush();
        });

        it('should have a navigate method attached to its scope', () => {
            expect(controller.navigate).toBeDefined();
        });

        it('should be able to flick through search results upwards', () => {
            controller.searchResults = searchResult;
            controller.navigate('up');

            expect(controller.searchResults.selected).toBe(1);

            controller.navigate('up');

            expect(controller.searchResults.selected).toBe(0);
        });

        it('should not be able to navigate up search results once on top', () => {
            controller.searchResults = searchResult;
            controller.searchResults.selected = 0;
            controller.navigate('up');

            expect(controller.searchResults.selected).toBe(0);
        });

        it('should be able to flick through search results downwards', () => {
            controller.searchResults = searchResult;
            controller.navigate('down');

            expect(controller.searchResults.selected).toBe(3);

            controller.navigate('down');

            expect(controller.searchResults.selected).toBe(4);
        });

        it('should not be able to navigate down search results once on bottom', () => {
            controller.searchResults = searchResult;
            controller.searchResults.selected = 4;
            controller.navigate('down');

            expect(controller.searchResults.selected).toBe(4);
        });
    });
}