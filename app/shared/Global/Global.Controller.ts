module openmaths {
    'use strict';

    export interface IGlobalControllerWindow extends ng.IWindowService {
        gApiInitialised: () => void;
    }

    export class GlobalController {
        bodyClass: string;
        gApiInitialised: boolean = false;

        constructor(private $rootScope: ng.IRootScopeService,
                    private $window: IGlobalControllerWindow) {
            $window.gApiInitialised = () => {
                this.gApiInitialised = true;

                openmaths.Logger.debug('gApi successfully initialised')
            };

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