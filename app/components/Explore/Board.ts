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

    export interface IBoardParams extends angular.ui.IStateParamsService {
        uriFriendlyTitle: string;
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
        columns:{
            current: number;
            max: number;
            min: number;
            uiClass: string;
        };
        rows:{
            current: number;
            max: number;
            min: number;
            uiClass: string;
        };

        grid:Array<Array<openmaths.Umi>>;
        state:string;

        constructor(public Api?:openmaths.Api,
                    public NotificationFactory?:openmaths.NotificationFactory,
                    public ModalFactory?:openmaths.ModalFactory,
                    public $scope?:ng.IScope) {
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
        }

        initGrid():Array<Array<openmaths.Umi>> {
            return _.map(_.range(this.rows.current), row => _.map(_.range(this.columns.current), box => new openmaths.Umi()));
        }

        // @TODO add keymaster implementation (alt+arrows)
        updateGrid(section:GridSection, action:UpdateGridOperator) {
            switch (section) {
                case GridSection.Column:
                    this.updateColumn(action);
                    break;
                case GridSection.Row:
                    this.updateRow(action);
                    break;
            }
        }

        updateColumn(action:UpdateGridOperator) {
            let current = this.columns.current;

            switch (action) {
                case UpdateGridOperator.ADD:
                    if (current == this.columns.max) return false;

                    this.columns.current = current + 1;

                    _.forEach(this.grid, row => row.push(new openmaths.Umi()));

                    break;
                case UpdateGridOperator.REMOVE:
                    if (current == this.columns.min) return false;

                    this.columns.current = current - 1;

                    // @TODO
                    // It should not be possible to remove a column if something is in there
                    _.forEach(this.grid, row => row.pop());

                    break;
            }

            this.columns.uiClass = 'columns-' + this.columns.current;
        }

        updateRow(action:UpdateGridOperator) {
            let current = this.rows.current;

            switch (action) {
                case UpdateGridOperator.ADD:
                    if (current == this.rows.max) return false;

                    this.rows.current = current + 1;

                    this.grid.push(_.map(_.range(this.columns.current), box => new openmaths.Umi()));

                    break;
                case UpdateGridOperator.REMOVE:
                    if (current == this.rows.min) return false;

                    this.rows.current = current - 1;

                    // @TODO
                    // It should not be possible to remove a column if something is in there
                    this.grid.pop();

                    break;
            }

            this.rows.uiClass = 'rows-' + this.rows.current;
        }

        showDetails(data:Umi) {
            this.ModalFactory.generate(new Modal(true, data.title, data));
        }

        canExpand(x:number, y:number, umiId:string, currentBoundary:UmiBoundary) {
            if (_.inRange(x, _.first(currentBoundary.horizontal), _.last(currentBoundary.horizontal))
                && _.inRange(y, _.first(currentBoundary.vertical), _.last(currentBoundary.vertical))) {
                return false;
            }

            // @TODO look into _.find implementation
            _.forEach(this.grid, (row:Array<Umi>, rowIndex:number) => {
                _.forEach(row, (umi:Umi, columnIndex:number) => {
                    if (_.inRange(x, _.first(umi.boundary.horizontal), _.last(umi.boundary.horizontal))
                        && _.inRange(y, _.first(umi.boundary.vertical), _.last(umi.boundary.vertical))) {

                        this.expandInto(rowIndex, columnIndex, GetUmiBy.Id, umiId);
                    }
                })
            });
        }

        expandInto(row:number, column:number, getBy:GetUmiBy, value:string) {
            const
                apiRoutes = openmaths.Config.getApiRoutes(),
                getUmiPromise = (getBy == GetUmiBy.Id)
                    ? this.getUmiPromise(apiRoutes.getUmiById + value) : this.getUmiPromise(apiRoutes.getUmiByTitle + value);

            // @TODO retries should be hoisted magic vars
            Rx.Observable.fromPromise(getUmiPromise)
                .map(d => openmaths.Api.response(d))
                .where(Rx.helpers.identity)
                .retry(3)
                .subscribe((d:IApiResponse) => {
                    const response:IUmi = d.data;

                    if (d.status == 'error') {
                        this.NotificationFactory.generate('Requested contribution has not been found.', NotificationType.Error, response);
                    } else {
                        this.grid[row][column] = new openmaths.Umi(response, [row, column]);
                        openmaths.Logger.debug('UMI ' + getBy + ' => ' + value + ' loaded.');
                    }
                }, errorData => {
                    this.NotificationFactory.generate('Requested contribution has not been found.', NotificationType.Error, errorData);
                });
        }

        getUmiPromise(url):ng.IHttpPromise<void> {
            return this.Api.get(url);
        }
    }
}