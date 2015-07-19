module openmaths.specs {
    'use strict';

    describe('Umi model', () => {
        let model: openmaths.Umi;

        beforeEach(() => {
            model = new openmaths.Umi;
        });

        it('should have a method checking whether a UMI is empty', () => {
            expect(model.isEmpty).toBeDefined();
        });

        it('should evaluate to empty if either id or uriFriendlyTitle is empty', () => {
            expect(model.empty).toEqual(true);

            model.id = 'testID';
            expect(model.isEmpty()).toEqual(true);

            model.uriFriendlyTitle = 'testTitle';
            expect(model.isEmpty()).toEqual(false);

            model.id = '';
            expect(model.isEmpty()).toEqual(true);
        });
    });
}