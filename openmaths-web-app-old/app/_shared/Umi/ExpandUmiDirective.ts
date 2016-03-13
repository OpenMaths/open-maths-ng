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
        disableExpansion: boolean;
    }

    interface IExpandUmiAttr extends ng.IAttributes {
        expandId: string;
        expandLabel: string;
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

        constructor($document:angular.IDocumentService,
                    public ModalFactory:openmaths.ModalFactory,
                    public Api:openmaths.Api,
                    public NotificationFactory:openmaths.NotificationFactory) {
            this.link = (scope:IExpandUmiDirectiveScope, ele, attr:IExpandUmiAttr) => {
                scope.expandId = attr.expandId;
                scope.expandLabel = attr.expandLabel;

                ele.addClass('expand-umi');

                // @TODO in this case, if it's in a modal, it should expand into a new modal (replace the contents)
                if (scope.disableExpansion) {
                    ele.addClass('disabled');

                    // @TODO Has to be here now to prevent the dragging functionality
                    ele.bind('click', (e) => {
                        e.preventDefault();

                        const promise = this.getUmiPromise(attr.expandId);

                        Rx.Observable.fromPromise(promise)
                            .map(d => openmaths.Api.response(d))
                            .where(Rx.helpers.identity)
                            .retry(3)
                            .subscribe((d:IApiResponse) => {
                                const
                                    response:IUmi = d.data;

                                if (d.status == 'error') {
                                    this.NotificationFactory.generate('Requested contribution has not been found.', NotificationType.Error, response);
                                } else {
                                    const Umi = new openmaths.Umi(response);

                                    this.ModalFactory.generate(new Modal(true, Umi.title, Umi));
                                    openmaths.Logger.debug('UMI id => ' + Umi.id + ' loaded.');
                                }
                            }, errorData => {
                                this.NotificationFactory.generate('Requested contribution has not been found.', NotificationType.Error, errorData);
                            });
                    });

                    return false;
                }

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

                    // @TODO investigate how best to inject this via selectively pulling in only the scope methods we need
                    scope.ExploreCtr.Board.canExpand(x, y, scope.expandId, scope.umi.boundary);
                }
            };
        }

        getUmiPromise(id:string):ng.IHttpPromise<void> {
            const apiRoutes = openmaths.Config.getApiRoutes();

            return this.Api.get(apiRoutes.getUmiById + id);
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
            return ($document:angular.IDocumentService,
                    ModalFactory:openmaths.ModalFactory,
                    Api:openmaths.Api,
                    NotificationFactory:openmaths.NotificationFactory) => {
                return new ExpandUmiDirective($document, ModalFactory, Api, NotificationFactory);
            };
        }
    }

    angular
        .module('openmaths')
        .directive('expandUmi', ExpandUmiDirective.init());
}