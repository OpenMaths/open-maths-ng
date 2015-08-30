module openmaths.specs {
    'use strict';

    describe('SearchUtils model', () => {
        let wrapper = 'mark';

        let useCases = [{
            term: 'ax', searchResult: 'axiom',
            expected: '<' + wrapper + '>ax</' + wrapper + '>iom'
        }, {
            term: 'e', searchResult: 'checked',
            expected: 'ch<' + wrapper + '>e</' + wrapper + '>ck<' + wrapper + '>e</' + wrapper + '>d'
        }, {
            term: 'a', searchResult: 'Axiom schema',
            expected: '<' + wrapper + '>A</' + wrapper + '>xiom schem<' + wrapper + '>a</' + wrapper + '>'
        }];

        _.forEach(useCases, useCase => {
            it('should highlight pattern matches in a result', () => {
                expect(openmaths.Search.Utils.highlightSearchTerm(useCase.term, useCase.searchResult))
                    .toEqual(useCase.expected);
            });
        });
    });
}