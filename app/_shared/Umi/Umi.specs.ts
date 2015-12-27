module openmaths.specs {
    'use strict';

    let initObjectData = {
        creator: 'testCreator',
        htmlContent: 'testContent',
        id: 'testId',
        latexContent: 'testLatexContent',
        latexContentId: 'testLatexContentId',
        meta: {
            id: 'testId',
            title: 'Test Title',
            umiType: 'testUmiType',
            uriFriendlyTitle: 'test-title',
        },
        prerequisiteDefinitions: [],
        seeAlso: [],
        tags: [],
        title: 'testTitle',
        titleSynonyms: [],
        ts: 1,
        umiType: 'testType'
    };

    let initObject = new openmaths.Umi(initObjectData, [1, 1]);

    describe('Umi model', () => {
        let model:openmaths.Umi;

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

            expect(model.formal).toEqual(false);
            expect(model.meta).toEqual(false);
        });

        it('should correctly evaluate whether a umiType is Formal', () => {
            let initObjectWithFormal:IUmi = _.clone(initObjectData);
            initObjectWithFormal.umiType = 'FormalDefinition';

            let modelWithInitObject = new openmaths.Umi(initObjectWithFormal);

            expect(modelWithInitObject.formal).toEqual(true);
            expect(modelWithInitObject.meta).toEqual(false);
            expect(modelWithInitObject.umiType).toEqual('Definition');
        });

        it('should correctly evaluate whether a umiType is FormalMeta', () => {
            let initObjectWithFormalMeta = _.clone(initObjectData);
            initObjectWithFormalMeta.umiType = 'FormalDefinitionMeta';

            let modelWithInitObject = new openmaths.Umi(initObjectWithFormalMeta);

            expect(modelWithInitObject.formal).toEqual(true);
            expect(modelWithInitObject.meta).toEqual(true);
            expect(modelWithInitObject.umiType).toEqual('Definition');
        });
    });
}