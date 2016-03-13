module openmaths {
    'use strict';

    export class ExploreController {
        Board:openmaths.Board;
        Dive:openmaths.Dive;

        view:string;
        openBoard:(searchReult:openmaths.SearchResult) => void;

        constructor(Api:openmaths.Api,
                    NotificationFactory:openmaths.NotificationFactory,
                    ModalFactory:openmaths.ModalFactory,
                    private $scope:ng.IScope,
                    private $rootScope:ng.IScope,
                    private $state:ng.ui.IStateService,
                    private $stateParams?:IContributeControllerParams) {
            this.Board = new openmaths.Board(Api, NotificationFactory, ModalFactory);
            this.Dive = new openmaths.Dive();

            this.updateState($state.current.name);

            $rootScope.$on('$stateChangeSuccess', (e, toState) => {
                this.updateState(toState.name);
            });

            // @NOTE this is because we want to be able to call this method as a callback in SearchController
            this.openBoard = (searchResult:openmaths.SearchResult) => {
                this.Board.expandInto(this.whereToExpand().row, this.whereToExpand().column, GetUmiBy.Id, searchResult.id);

                $state.go('explore.board', {uriFriendlyTitle: searchResult.id});
            };

            if (!_.isEmpty(this.$stateParams.uriFriendlyTitle)) {
                this.Board.expandInto(this.whereToExpand().row, this.whereToExpand().column, GetUmiBy.Id, this.$stateParams.uriFriendlyTitle);
                $state.go('explore.board', {uriFriendlyTitle: this.$stateParams.uriFriendlyTitle});
            }

            // @TODO make this work without having to focus into the HTML with a mouse
            key('shift+right', () => {
                this.Board.updateGrid(GridSection.Column, UpdateGridOperator.ADD);
                $scope.$apply();
            });
            key('shift+left', () => {
                this.Board.updateGrid(GridSection.Column, UpdateGridOperator.REMOVE);
                $scope.$apply();
            });
            key('shift+down', () => {
                this.Board.updateGrid(GridSection.Row, UpdateGridOperator.ADD);
                $scope.$apply();
            });
            key('shift+up', () => {
                this.Board.updateGrid(GridSection.Row, UpdateGridOperator.REMOVE);
                $scope.$apply();
            });
        }

        whereToExpand():{row:number;column:number} {
            return {
                row: this.Board.columns.current !== 3 || this.Board.rows.current !== 3 ? 0 : 1,
                column: this.Board.columns.current !== 3 || this.Board.rows.current !== 3 ? 0 : 1
            }
        }

        updateState(toState:string) {
            switch (toState) {
                case this.Board.state:
                    this.view = 'board';
                    break;
                case this.Dive.state:
                    this.view = 'dive';
                    break;
            }
        }
    }

    angular
        .module('openmaths')
        .controller('ExploreController', ExploreController);
}