module openmaths.specs {
    'use strict';

    describe('MutationForm model', () => {
        let model: openmaths.MutationForm;

        beforeEach(() => {
            model = new openmaths.MutationForm();
        });

        it('should create a new model', () => {
            expect(model).toBeDefined();
        });

        it('should reset all entries\' active state to false', () => {
            model.content.active = true;
            model.prerequisiteDefinitionIds.active = true;

            model.resetActive();

            _.forEach(model, (entry: IMutationFormObject) => {
                if (entry.description) expect(entry.active).toEqual(false);
            });
        });
    });
}