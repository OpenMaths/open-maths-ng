module openmaths {
    'use strict';

    interface IBoard {
        columns: {
            current: number;
            max: number;
            min: number;
        };
        rows: {
            current: number;
            max: number;
            min: number;
        };
        grid: Array<Array<{}>>;
        state: string;
    }

    export class Board implements IBoard {
        columns: {
            current: number;
            max: number;
            min: number;
        };
        rows: {
            current: number;
            max: number;
            min: number;
        };
        grid: Array<Array<{}>>;
        state: string;

        constructor() {
            this.columns = {
                current: 3,
                max: 6,
                min: 1
            };
            this.rows = {
                current: 3,
                max: 6,
                min: 1
            };
            this.state = 'explore.board';

            this.grid = _.fill(Array(this.columns.current), _.fill(Array(this.rows.current), {}));
        }

        updateGrid(type: string, action: string) {
            switch (type) {
                case 'column':
                    Column[action](this.grid);
                    break;
                case 'row':
                    Row[action](this.grid);
                    break;
            }
        }
    }

    class Column {
        static add(grid: Array<Array<{}>>) {
            console.log('Adding a column to the grid');
        }

        static remove(grid: Array<Array<{}>>) {
            console.log('Removing a column from the grid');
        }
    }

    class Row {
        static add(grid: Array<Array<{}>>) {
            console.log('Adding a row to the grid');
        }

        static remove(grid: Array<Array<{}>>) {
            console.log('Removing a row from the grid');
        }
    }
}