module openmaths {
    'use strict';

    interface IDive {
        state: string;
    }

    class Dive implements IDive {
        state = 'explore';
    }

    interface IBoard {
        state: string;
    }

    class Board implements IBoard {
        state = 'explore.board';
    }

    export class ExploreController {
        Board = new Board();
        Dive = new Dive();

        triggerBoard: (uriFriendlyTitle: string) => void;
        view: string;

        constructor($rootScope: ng.IScope, $state: ng.ui.IStateService) {
            this.updateState($state.current.name);

            $rootScope.$on('$stateChangeSuccess', (e, toState) => {
                this.updateState(toState.name);
                console.log(this.view);
            });

            this.triggerBoard = (uriFriendlyTitle: string) => {
                $state.go('explore.board', {uriFriendlyTitle: uriFriendlyTitle});
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