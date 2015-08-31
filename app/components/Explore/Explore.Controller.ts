module openmaths {
    'use strict';

    export class ExploreController {
        Board: openmaths.Board;
        Dive: openmaths.Dive;

        view: string;
        openBoard: (searchReult: openmaths.SearchResult) => void;

        constructor(Api: openmaths.Api,
                    NotificationFactory: openmaths.NotificationFactory,
                    private $rootScope: ng.IScope,
                    $state: ng.ui.IStateService) {
            this.Board = new openmaths.Board(Api, NotificationFactory);
            this.Dive = new openmaths.Dive();

            this.updateState($state.current.name);

            $rootScope.$on('$stateChangeSuccess', (e, toState) => {
                this.updateState(toState.name);
            });

            // @NOTE this is because we want to be able to call this method as a callback in SearchController
            this.openBoard = (searchResult: openmaths.SearchResult) => {
                this.Board.expandInto(1, 1, GetUmiBy.Title, searchResult.uriFriendlyTitle);

                $state.go('explore.board', {uriFriendlyTitle: searchResult.uriFriendlyTitle});
            }
        }

        updateState(toState: string) {
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