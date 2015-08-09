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