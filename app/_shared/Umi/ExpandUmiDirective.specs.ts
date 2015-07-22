module openmaths.specs {
    'use strict';

    describe('ExpandUmiDirective model', () => {
        beforeEach(module('openmaths'));

        it('should have the directive constructor', () => {
            expect(openmaths.ExpandUmiDirective.init).toBeDefined();
        });

        let gridConfig = {
            columns: {
                current: 3,
                max: 6,
                min: 1,
                uiClass: ''
            },
            rows: {
                current: 3,
                max: 6,
                min: 1,
                uiClass: ''
            }
        };

        let scenarios = [
            {original: [1, 1], expected: [['top', 0, 1], ['right', 1, 2], ['bottom', 2, 1], ['left', 1, 0]]},
            {original: [0, 1], expected: [['top', 0, 1], ['right', 0, 2], ['bottom', 1, 1], ['left', 0, 0]]},
            {original: [1, 2], expected: [['top', 0, 2], ['right', 1, 2], ['bottom', 2, 2], ['left', 1, 1]]},
            {original: [2, 1], expected: [['top', 1, 1], ['right', 2, 2], ['bottom', 2, 1], ['left', 2, 0]]},
            {original: [1, 0], expected: [['top', 0, 0], ['right', 1, 1], ['bottom', 2, 0], ['left', 1, 0]]},
            {original: [0, 2], expected: [['top', 0, 2], ['right', 0, 2], ['bottom', 1, 2], ['left', 0, 1]]}
        ];

        _.forEach(scenarios, scenario => {
            it('should correctly render expand arrows given current position ' + JSON.stringify(scenario.original), () => {
                let directions = openmaths.ExpandUmiDirective.renderDirections(scenario.original, gridConfig);

                expect(_.map(directions, direction => _.values(direction))).toEqual(scenario.expected);
            });
        });
    });
}