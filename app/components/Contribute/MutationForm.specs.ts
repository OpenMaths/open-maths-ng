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

        // @TODO execute for more scenarios
        it('should correctly update seeAlso values when instructed', () => {
            model.updateValues(UpdateValues.SeeAlso, testSearchResult);

            expect(model.seeAlsoIds.value['testId']).toEqual('testTitle');
        });
    });
}