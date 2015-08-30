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
                //console.log(toState);
                this.uiConfig = openmaths.Config.getUiConfig();
                this.uiConfig.currentState = toState.uiConfig;
                this.bodyClass = this.uiConfig.currentState.bodyClass;
            });
        }

        // @TODO abstract into a util or sth..
        static isSignedIn(): boolean {
            // @TODO abstract into a util or sth..
            let omUser = openmaths.SessionStorage.get('omUser');

            return !_.isEmpty(omUser.gPlusId) && !_.isEmpty(omUser.accessToken);
        }

        signIn() {
            if (this.gApiInitialised && !openmaths.GlobalController.isSignedIn()) this.Authentication.gApiLogin();
        }

        // @TODO implement
        //signOut() {
        //    if (this.gApiInitialised && openmaths.GlobalController.isSignedIn()) this.Authentication.gApiLogout();
        //}
    }

    angular
        .module('openmaths')
        .controller('GlobalController', GlobalController);
}