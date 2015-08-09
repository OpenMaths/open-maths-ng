module openmaths {
    'use strict';

    export interface IGlobalControllerWindow extends ng.IWindowService {
        gApiInitialised: () => void;
    }

    export class GlobalController {
        bodyClass: string;
        currentBaseState: string;
        gApiInitialised: boolean = false;
        uiConfig: IUiConfig;

        constructor(public Authentication: openmaths.Authentication,
                    private $rootScope: ng.IRootScopeService,
                    private $window: IGlobalControllerWindow) {
            $window.gApiInitialised = () => {
                this.gApiInitialised = true;

                openmaths.Logger.debug('gApi successfully initialised');
            };

            $rootScope.$on('$stateChangeSuccess', (e, toState) => {
                // The type of states needs to be declared
                let states: Array<string> = toState.name.split('.');

                this.currentBaseState = _.first(states);
                this.bodyClass = 'page-' + this.currentBaseState;

                this.uiConfig = openmaths.Config.getUiConfig();
                this.uiConfig.currentState = toState.uiConfig;
            });
        }

        static isSignedIn(): boolean {
            let omUser = openmaths.SessionStorage.get('omUser');

            return omUser.gPlusId && omUser.accessToken;
        }

        signIn() {
            if (this.gApiInitialised && !openmaths.GlobalController.isSignedIn()) this.Authentication.gApiLogin();
        }
    }

    angular
        .module('openmaths')
        .controller('GlobalController', GlobalController);
}