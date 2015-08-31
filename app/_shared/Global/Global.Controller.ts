module openmaths {
    'use strict';

    export interface IGlobalControllerWindow extends ng.IWindowService {
        gApiInitialised: () => void;
    }

    export class GlobalController {
        bodyClass: string;
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
                this.uiConfig = openmaths.Config.getUiConfig();
                this.uiConfig.currentState = toState.uiConfig;

                this.bodyClass = this.uiConfig.currentState.bodyClass;
            });
        }

        signIn() {
            if (this.gApiInitialised && !openmaths.User.isSignedIn()) this.Authentication.gApiLogin();
        }

        signOut() {
            if (openmaths.User.isSignedIn()) this.Authentication.gApiLogout();
        }
    }

    angular
        .module('openmaths')
        .controller('GlobalController', GlobalController);
}