module openmaths.specs {
    'use strict';

    let initObject: IUmi = {
        creator: 'testCreator',
        htmlContent: 'testContent',
        id: 'testId',
        latexContent: 'testLatexContent',
        latexContentId: 'testLatexContentId',
        prerequisiteDefinitions: [],
        seeAlso: [],
        tags: [],
        title: 'testTitle',
        titleSynonyms: [],
        ts: 1,
        umiType: 'testType',
        uriFriendlyTitle: 'testUriFriendlyTitle',
        where: [1, 1]
    };

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

        it('should set the correct values if initObject has been provided', () => {
            let modelWithInitObject = new openmaths.Umi(initObject);

            _.forEach(initObject, (value: any, key: string) => {
                expect(modelWithInitObject[key]).toEqual(value);
            });
        });
    });
}