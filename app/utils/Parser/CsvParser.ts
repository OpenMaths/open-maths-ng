module openmaths {
    'use strict';

    interface IAfterEntryRemoved {
        list: Array<any>;
        value: string;
    }

    export class CsvParser {
        static parse(values: string): Array<any> {
            return values.length == 0 ? [] : _.filter(_.uniq(_.map(values.split(','), value => _.trim(value))), v => !_.isEmpty(v));
        }

        static removeFromList(source: Array<any>, label: any): IAfterEntryRemoved {
            let newList = _.without(source, label);

            return {
                list: newList,
                value: newList.join(', ')
            }
        }
    }
}