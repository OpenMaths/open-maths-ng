module openmaths {
    'use strict';

    export class CsvParser {
        static parse(values: string): Array<any> {
            return values.length == 0 ? [] : _.filter(_.uniq(_.map(values.split(','), value => _.trim(value))), v => !_.isEmpty(v));
        }
    }
}