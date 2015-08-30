module openmaths.Search {
    'use strict';

    export class Utils {
        static regexFlags = 'gi';
        static wrapper = 'mark';

        static highlightSearchTerm(term: string, searchResult: string): string {
            let regex = new RegExp(term, Utils.regexFlags);

            return searchResult.replace(regex, match => Utils.wrap(match));
        }

        private static wrap(match: string): string {
            return '<' + Utils.wrapper + '>' + match + '</' + Utils.wrapper + '>';
        }
    }
}