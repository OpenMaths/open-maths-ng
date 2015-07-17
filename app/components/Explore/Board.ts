module openmaths {
    'use strict';

    export enum UpdateGridOperator {
        ADD, REMOVE
    }

    export enum GridSection {
        Column, Row
    }

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

        updateGrid(section: GridSection, action: UpdateGridOperator) {
            switch (section) {
                case GridSection.Column:
                    this.updateColumn(action);
                    break;
                case GridSection.Row:
                    this.updateRow(action);
                    break;
            }
        }

        updateColumn(action: UpdateGridOperator) {
            let current = this.columns.current;

            switch (action) {
                case UpdateGridOperator.ADD:
                    console.log('Adding a column to the grid');
                    this.columns.current = (current == this.columns.max) ? current : current + 1;
                    break;
                case UpdateGridOperator.REMOVE:
                    console.log('Removing a column from the grid');
                    this.columns.current = (current == this.columns.min) ? current : current - 1;
                    break;
            }
        }

        updateRow(action: UpdateGridOperator) {
            let current = this.rows.current;

            switch (action) {
                case UpdateGridOperator.ADD:
                    console.log('Adding a row to the grid');
                    this.rows.current = (current == this.rows.max) ? current : current + 1;
                    break;
                case UpdateGridOperator.REMOVE:
                    console.log('Removing a row from the grid');
                    this.rows.current = (current == this.rows.min) ? current : current - 1;
                    break;
            }
        }
    }
}