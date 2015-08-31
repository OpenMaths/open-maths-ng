module openmaths.specs {
    'use strict';

    let scenarios = [
        {value: '', expected: []},
        {value: ' test ', expected: ['test']},
        {value: ' test,test', expected: ['test']},
        {value: ' test,test,', expected: ['test']},
        {value: 'test1, test 2', expected: ['test1', 'test 2']},
        {value: '  test 1 , test  2,test 3, test4', expected: ['test 1', 'test  2', 'test 3', 'test4']}
    ];

    describe('CsvParser module', () => {
        _.forEach(scenarios, scenario => {
            it('should correctly parse csv into an array', () => {
                expect(openmaths.CsvParser.parse(scenario.value)).toEqual(scenario.expected);
            });
        });

        it('should correctly remove an element from a list', () => {
            expect(openmaths.CsvParser.removeFromList(['a', 'b', 'c'], 'b')).toEqual({
                list: ['a', 'c'],
                value: 'a, c'
            });
        })
    });
}