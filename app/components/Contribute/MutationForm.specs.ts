module openmaths.specs {
    'use strict';

    let testSearchResult:openmaths.SearchResult = new SearchResult({
        id: 'testId',
        title: 'testTitle',
        uriFriendlyTitle: 'testUriFriendlyTitle',
        umiType: 'testUmiType'
    });

    describe('MutationForm model', () => {
        let model:openmaths.MutationForm;

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

            _.forEach(model, (entry:IMutationFormObject) => {
                if (entry.description) expect(entry.active).toEqual(false);
            });
        });

        // @TODO test with more diverse scenarios
        it('should correctly update seeAlso values when instructed', () => {
            model.updateValues(UpdateValues.SeeAlso, testSearchResult);

            expect(model.seeAlsoIds.value[0]).toEqual({
                id: 'testId',
                show: true,
                title: 'testTitle'
            });
        });

        // @TODO test with more diverse scenarios
        it('should correctly remove seeAlso value when instructed', () => {
            model.seeAlsoIds.value[0] = {id: 1, title: 'testTitle', show: true};

            model.removeValues(UpdateValues.SeeAlso, 0);

            expect(model.seeAlsoIds.value[0]).toBeUndefined();
        });
    });

    describe('MutationApi model', () => {
        beforeEach(angular.mock.module('openmaths'));

        let Api:openmaths.Api;
        let $httpBackend:ng.IHttpBackendService;
        let model:openmaths.MutationApi;

        beforeEach(inject((_Api_:openmaths.Api,
                           _$httpBackend_:ng.IHttpBackendService) => {
            Api = _Api_;
            $httpBackend = _$httpBackend_;

            model = new openmaths.MutationApi(Api);
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

        it('should be able to return a checkUpdateContent promise', () => {
            let addr = openmaths.Config.getApiUrl() + openmaths.Config.getApiRoutes().checkUpdate,
                payload = new openmaths.Mutation(new openmaths.MutationForm());

            $httpBackend.expectPOST(addr).respond(200, 'success');

            model.checkUpdateContentPromise(payload).then(result => expect(result.data).toEqual('success'));

            $httpBackend.flush();
        });

        it('should be able to return a createUmi promise', () => {
            let addr = openmaths.Config.getApiUrl() + openmaths.Config.getApiRoutes().createUmi,
                payload = new openmaths.Mutation(new openmaths.MutationForm());

            $httpBackend.expectPOST(addr).respond(200, 'success');

            model.createUmiPromise(payload).then(result => expect(result.data).toEqual('success'));

            $httpBackend.flush();
        });

        it('should be able to return a updateUmi promise', () => {
            let addr = openmaths.Config.getApiUrl() + openmaths.Config.getApiRoutes().update,
                payload = new openmaths.Mutation(new openmaths.MutationForm());

            $httpBackend.expectPOST(addr).respond(200, 'success');

            model.updateUmiPromise(payload).then(result => expect(result.data).toEqual('success'));

            $httpBackend.flush();
        });

        it('should have a parse() method responsible for UMI content parsing', () => {
            expect(model.parseContent).toBeDefined();
        });

        it('should have a create() method responsible for UMI creation', () => {
            expect(model.createContent).toBeDefined();
        });

        it('should have a update() method responsible for UMI edits / updates', () => {
            expect(model.updateContent).toBeDefined();
        });
    });

    describe('Mutation model', () => {
        let MutationForm:openmaths.MutationForm;
        let UmiTypes:openmaths.UmiTypes = new openmaths.UmiTypes();

        beforeEach(() => {
            MutationForm = new openmaths.MutationForm();
        });

        it('should correctly assign Formal prefix when valid', () => {
            MutationForm.umiType.value = 'Definition';
            MutationForm.advancedTypeOptions.value.formal = true;

            let Mutation = new openmaths.Mutation(MutationForm);

            expect(Mutation.umiType).toEqual('Formal' + UmiTypes.Definition.label);
        });

        it('should correctly assign Formal prefix and Meta appendix when valid', () => {
            MutationForm.umiType.value = 'Definition';
            MutationForm.advancedTypeOptions.value.formal = true;
            MutationForm.advancedTypeOptions.value.meta = true;

            let Mutation = new openmaths.Mutation(MutationForm);

            expect(Mutation.umiType).toEqual('Formal' + UmiTypes.Definition.label + 'Meta');
        });

        it('should correctly NOT assign Formal prefix and Meta appendix when invalid', () => {
            MutationForm.umiType.value = 'Example';
            MutationForm.advancedTypeOptions.value.formal = true;
            MutationForm.advancedTypeOptions.value.meta = true;

            let Mutation = new openmaths.Mutation(MutationForm);

            expect(Mutation.umiType).toEqual(UmiTypes.Example.label);
        });
    });
}