module openmaths {
    'use strict';

    export class ExploreController {
        triggerBoard: (uriFriendlyTitle: string) => void;
        view: string;

        constructor($state: ng.ui.IStateService) {
            this.triggerBoard = (uriFriendlyTitle: string) => {
                console.log(uriFriendlyTitle);

                $state.go('explore.board', {uriFriendlyTitle: uriFriendlyTitle});
                this.view = 'board';
            }
        }
    }

    angular
        .module('openmaths')
        .controller('ExploreController', ExploreController);
}