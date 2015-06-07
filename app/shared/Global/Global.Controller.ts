module openmaths {
    'use strict';

    export interface IGlobalControllerWindow extends ng.IWindowService {
        gApiInitialised: () => void;
    }

    export class GlobalController {
        currentBaseState: string;
        bodyClass: string;
        gApiInitialised: boolean = false;

        constructor(private Authentication: openmaths.Authentication,
                    private $rootScope: ng.IRootScopeService,
                    private $window: IGlobalControllerWindow) {
            $window.gApiInitialised = () => {
                this.gApiInitialised = true;

                // @TODO
                // different location for this after development
                //Authentication.gApiLogin();

                openmaths.Logger.debug('gApi successfully initialised');
            };

            $rootScope.$on('$stateChangeSuccess', (e, toState) => {
                let states: Array<string> = toState.name.split('.');

                this.currentBaseState = _.first(states);
                this.bodyClass = 'page-' + this.currentBaseState;
            });
        }
    }

    angular
        .module('openmaths')
        .controller('GlobalController', GlobalController);
}