module openmaths {
    'use strict';

    interface IExpandUmiDirectiveScope extends ng.IScope {
        columns: IGridPartConfig;
        directions: Array<IExpandUmiDirection>;
        expandId: string;
        expandLabel: string;
        rows: IGridPartConfig;
        umi: openmaths.Umi;
    }

    interface IExpandUmiAttr extends ng.IAttributes {
        expandId: string;
        expandLabel: string;
        umi: openmaths.Umi;
    }

    interface IExpandUmiDirection {
        direction: string;
        toRow: number;
        toColumn: number;
    }

    interface IGridConfig {
        columns: IGridPartConfig;
        rows: IGridPartConfig;
    }

    export class ExpandUmiDirective implements ng.IDirective {
        link;
        restrict = 'A';
        scope = false;
        templateUrl = 'app/_shared/Umi/expandUmi.html';

        constructor() {
            this.link = (scope: IExpandUmiDirectiveScope, ele, attr: IExpandUmiAttr) => {
                scope.$watch('umi.htmlContent', () => {
                    if (scope.umi.empty) return false;

                    let gridConfig = {
                        columns: scope.columns,
                        rows: scope.rows
                    };

                    scope.expandId = attr.expandId;
                    scope.expandLabel = attr.expandLabel;
                    scope.directions = openmaths.ExpandUmiDirective.renderDirections(scope.umi.where, gridConfig);
                });
            };
        }

        static renderDirections(currentPosition: number[], gridConfig: IGridConfig): Array<IExpandUmiDirection> {
            let directions: string[] = ['top', 'right', 'bottom', 'left'],
                row: number = _.first(currentPosition),
                column: number = _.last(currentPosition);

            return _.map(directions, direction => {
                let vertical = direction == 'top' || direction == 'bottom',
                    horizontal = direction == 'right' || direction == 'left',
                    maxRow = gridConfig.rows.current - 1,
                    maxColumn = gridConfig.columns.current - 1,
                    minRow = gridConfig.rows.min - 1,
                    minColumn = gridConfig.columns.min - 1;

                return {
                    direction: direction,
                    toRow: vertical
                        ? (direction == 'top'
                        ? (row == minRow ? row : row - 1) : (row == maxRow ? row : row + 1)) : row,
                    toColumn: horizontal
                        ? (direction == 'right'
                        ? (column == maxColumn ? column : column + 1) : (column == minColumn ? column : column - 1)) : column
                };
            });
        }

        static init(): ng.IDirectiveFactory {
            return () => {
                return new ExpandUmiDirective();
            };
        }
    }

    angular
        .module('openmaths')
        .directive('expandUmi', ExpandUmiDirective.init());
}