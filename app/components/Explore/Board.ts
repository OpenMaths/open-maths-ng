module openmaths {
    'use strict';

    export enum UpdateGridOperator {
        ADD, REMOVE
    }

    export enum GridSection {
        Column, Row
    }

    export enum GetUmiBy {
        Id, Title
    }

    export interface IGridPartConfig {
        current: number;
        max: number;
        min: number;
        uiClass: string;
    }

    interface IBoard {
        columns: IGridPartConfig;
        rows: IGridPartConfig;
        grid: Array<Array<openmaths.Umi>>;
        state: string;
    }

    export class Board implements IBoard {
        columns: {
            current: number;
            max: number;
            min: number;
            uiClass: string;
        };
        rows: {
            current: number;
            max: number;
            min: number;
            uiClass: string;
        };
        grid: Array<Array<openmaths.Umi>>;
        state: string;

        constructor(public Api?: openmaths.Api,
                    public NotificationFactory?: openmaths.NotificationFactory) {
            this.columns = {
                current: 3,
                max: 6,
                min: 1,
                // @TODO
                // make so that it takes this.columns.current
                uiClass: 'columns-' + 3,
            };
            this.rows = {
                current: 3,
                max: 6,
                min: 1,
                // @TODO
                // make so that it takes this.rows.current
                uiClass: 'rows-' + 3,
            };
            this.state = 'explore.board';

            this.grid = this.initGrid();

            // @TODO
            // remove after testing
            if (openmaths.Debug.getEnvironment() == 'development') this.expandInto(1, 1, GetUmiBy.Title, 'set-intersection');
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

                    this.columns.current = current + 1;

                    _.forEach(this.grid, row => row.push(new openmaths.Umi()));

                    break;
                case UpdateGridOperator.REMOVE:
                    console.log('Removing a column from the grid');
                    if (current == this.columns.min) return false;

                    this.columns.current = current - 1;

                    // @TODO
                    // It should not be possible to remove a column if something is in there
                    _.forEach(this.grid, row => row.pop());

                    break;
            }

            this.columns.uiClass = 'columns-' + this.columns.current;
        }

        updateRow(action: UpdateGridOperator) {
            let current = this.rows.current;

            switch (action) {
                case UpdateGridOperator.ADD:
                    console.log('Adding a row to the grid');
                    if (current == this.rows.max) return false;

                    this.rows.current = current + 1;

                    this.grid.push(_.map(_.range(this.columns.current), box => new openmaths.Umi()));

                    break;
                case UpdateGridOperator.REMOVE:
                    console.log('Removing a row from the grid');
                    if (current == this.rows.min) return false;

                    this.rows.current = current - 1;

                    // @TODO
                    // It should not be possible to remove a column if something is in there
                    this.grid.pop();

                    break;
            }

            this.rows.uiClass = 'rows-' + this.rows.current;
        }

        expandInto(row: number, column: number, getBy: GetUmiBy, value: string) {
            let apiRoutes = openmaths.Config.getApiRoutes();

            let getUmiPromise = (getBy == GetUmiBy.Id)
                ? this.getUmiPromise(apiRoutes.getUmiById + value) : this.getUmiPromise(apiRoutes.getUmiByTitle + value);

            Rx.Observable.fromPromise(getUmiPromise)
                .map(d => openmaths.Api.response(d))
                .where(Rx.helpers.identity)
                .subscribe((d: IApiResponse) => {
                    // @TODO get rid of formatter after the API has been refactored
                    let response: IUmi = openmaths.Umi.umiTempFormatter(d.data);

                    this.grid[row][column] = new openmaths.Umi(response, [row, column]);

                    openmaths.Logger.debug('UMI ' + getBy + ' => ' + value + ' loaded.');
                }, errorData => {
                    this.NotificationFactory.generate('Requested contribution has not been found.', 'error', errorData);
                });
        }

        getUmiPromise(url): ng.IHttpPromise<void> {
            return this.Api.get(url);
        }
    }
}