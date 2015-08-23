module openmaths.specs {
    'use strict';

    let testSearchResult: ISearchResult = {
        id: 'testId',
        title: 'testTitle',
        uriFriendlyTitle: 'testUriFriendlyTitle',
        umiType: 'testUmiType'
    };

    describe('MutationForm model', () => {
        let model: openmaths.MutationForm;

        beforeEach(() => {
            model = new openmaths.MutationForm();
        });

        it('should create a new model', () => {
            expect(model).toBeDefined();
        });

        it('should set title entry active to true on init', () => {
            expect(model.title.active).toEqual(true);
        });

        it('should reset all entries\' active state to false', () => {
            model.content.active = true;
            model.prerequisiteDefinitionIds.active = true;

            model.resetActive();

            _.forEach(model, (entry: IMutationFormObject) => {
                if (entry.description) expect(entry.active).toEqual(false);
            });
        });

        // @TODO test with more diverse scenarios
        it('should correctly update seeAlso values when instructed', () => {
            model.updateValues(UpdateValues.SeeAlso, testSearchResult);

            expect(model.seeAlsoIds.value['testId']).toEqual('testTitle');
        });

        // @TODO test with more diverse scenarios
        it('should correctly remove seeAlso value when instructed', () => {
            model.seeAlsoIds.value['toBeRemoved'] = 'value';

            model.removeValues(UpdateValues.SeeAlso, 'toBeRemoved');

            expect(model.seeAlsoIds.value['toBeRemoved']).toBeUndefined();
        });
    });

    describe('SubmitMutation model', () => {
        beforeEach(module('openmaths'));

        let Api: openmaths.Api;
        let $httpBackend: ng.IHttpBackendService;
        let model: openmaths.SubmitMutation;

        beforeEach(inject((_Api_: openmaths.Api,
                           _$httpBackend_: ng.IHttpBackendService) => {
            Api = _Api_;
            $httpBackend = _$httpBackend_;

            model = new openmaths.SubmitMutation(Api);
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be able to return a latexToHtml promise', () => {
            let addr = openmaths.Config.getApiUrl() + openmaths.Config.getApiRoutes().latexToHtml,
                payload = {
                    auth: {
                        accessToken: '',
                        gPlusId: ''
                    },
                    s: 'htmlContent'
                };

            $httpBackend.expectPOST(addr).respond(200, 'htmlContent');

            model.latexToHtmlPromise(payload).then(result => expect(result.data).toEqual('htmlContent'));

            $httpBackend.flush();
        });

        it('should be able to return a checkContent promise', () => {
            let addr = openmaths.Config.getApiUrl() + openmaths.Config.getApiRoutes().check,
                payload = new openmaths.Mutation(new openmaths.MutationForm());

            $httpBackend.expectPOST(addr).respond(200, 'success');

            model.checkContentPromise(payload).then(result => expect(result.data).toEqual('success'));

            $httpBackend.flush();
        });

        it('should be able to return a createUmi promise', () => {
            let addr = openmaths.Config.getApiUrl() + openmaths.Config.getApiRoutes().createUmi,
                payload = new openmaths.Mutation(new openmaths.MutationForm());

            $httpBackend.expectPOST(addr).respond(200, 'success');

            model.createUmiPromise(payload).then(result => expect(result.data).toEqual('success'));

            $httpBackend.flush();
        });
    });
}