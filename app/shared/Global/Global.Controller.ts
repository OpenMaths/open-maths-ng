module openmaths {
    'use strict';

    export class GlobalController {
        bodyClass: string;

        constructor(private $rootScope: ng.IRootScopeService) {
            $rootScope.$on('$stateChangeSuccess', (e, toState) => {
                let states: Array<string> = toState.name.split('.');

                this.bodyClass = 'page-' + _.first(states);
            });
        }
    }

    angular
        .module('openmaths')
        .controller('GlobalController', GlobalController);
}