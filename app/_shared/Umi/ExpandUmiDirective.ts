module openmaths {
    'use strict';

    interface IExpandUmiDirectiveScope extends ng.IScope {
        columns: IGridPartConfig;
        directions: Array<IExpandUmiDirection>;
        expandId: string;
        expandLabel: string;
        ExploreCtr: ExploreController;
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
        scope = true;
        templateUrl = 'app/_shared/Umi/expandUmi.html';

        constructor($document:angular.IDocumentService) {
            this.link = (scope:IExpandUmiDirectiveScope, ele, attr:IExpandUmiAttr) => {
                if (scope.umi.empty) return false;

                ele.addClass('expand-umi');

                scope.$watch('umi.htmlContent', () => {
                    let gridConfig = {
                        columns: scope.columns,
                        rows: scope.rows
                    };

                    scope.expandId = attr.expandId;
                    scope.expandLabel = attr.expandLabel;
                    scope.directions = openmaths.ExpandUmiDirective.renderDirections(scope.umi.where, gridConfig);
                });

                let x, y;

                ele.on('mousedown', event => {
                    event.preventDefault();

                    x = event.pageX;
                    y = event.pageY;

                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove(event) {
                    x = event.clientX;
                    y = event.clientY;
                }

                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);

                    scope.ExploreCtr.Board.canExpand(x, y, scope.expandId, scope.umi.boundary);
                }
            };
        }

        static renderDirections(currentPosition:number[], gridConfig:IGridConfig):Array<IExpandUmiDirection> {
            let directions:string[] = ['up', 'right', 'down', 'left'],
                row:number = _.first(currentPosition),
                column:number = _.last(currentPosition);

            return _.map(directions, direction => {
                let vertical = direction == 'up' || direction == 'down',
                    horizontal = direction == 'right' || direction == 'left',
                    maxRow = gridConfig.rows.current - 1,
                    maxColumn = gridConfig.columns.current - 1,
                    minRow = gridConfig.rows.min - 1,
                    minColumn = gridConfig.columns.min - 1;

                return {
                    direction: direction,
                    toRow: vertical
                        ? (direction == 'up'
                        ? (row == minRow ? row : row - 1) : (row == maxRow ? row : row + 1)) : row,
                    toColumn: horizontal
                        ? (direction == 'right'
                        ? (column == maxColumn ? column : column + 1) : (column == minColumn ? column : column - 1)) : column
                };
            });
        }

        static init():ng.IDirectiveFactory {
            return ($document:angular.IDocumentService) => {
                return new ExpandUmiDirective($document);
            };
        }
    }

    angular
        .module('openmaths')
        .directive('expandUmi', ExpandUmiDirective.init());
}