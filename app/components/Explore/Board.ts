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
        grid: Array<Array<openmaths.Umi>>;
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
        grid: Array<Array<openmaths.Umi>>;
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
            this.grid = this.initGrid();
        }

        initGrid(): Array<Array<openmaths.Umi>> {
            return _.map(_.range(this.rows.current), row => _.map(_.range(this.columns.current), box => new openmaths.Umi()));
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
                    if (current == this.columns.max) return false;

                    this.columns.current = (current == this.columns.max) ? current : current + 1;

                    _.forEach(this.grid, row => {
                        row.push(new openmaths.Umi());
                    });

                    break;
                case UpdateGridOperator.REMOVE:
                    console.log('Removing a column from the grid');
                    if (current == this.columns.min) return false;

                    this.columns.current = (current == this.columns.min) ? current : current - 1;

                    // It should not be possible to remove a column if something is in there

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