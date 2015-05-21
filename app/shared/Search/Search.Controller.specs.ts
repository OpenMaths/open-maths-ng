module openmaths.specs {
    'use strict';

    describe('SearchController', () => {
        beforeEach(module('openmaths'));

        let Api;
        let controller: openmaths.SearchController;
        let $httpBackend;
        let $rootScope: ng.IRootScopeService;

        let searchResult = {
            selected: 0,
            data: []
        };

        beforeEach(inject((_Api_: openmaths.Api,
                           _$httpBackend_: ng.IHttpBackendService,
                           _$rootScope_: ng.IRootScopeService) => {
            $httpBackend = _$httpBackend_;

            Api = _Api_;
            $rootScope = _$rootScope_;

            controller = new openmaths.SearchController(Api, $rootScope.$new());
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should create a new controller', () => {
            expect(controller).toBeDefined();
        });

        it('should have a navigate method attached to its scope', () => {
            expect(controller.navigate).toBeDefined();
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
    });
}