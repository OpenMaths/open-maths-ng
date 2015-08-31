module openmaths {
    'use strict';

    export interface IGlobalControllerWindow extends ng.IWindowService {
        gApiInitialised: () => void;
    }

    export class GlobalController {
        bodyClass: string;
        gApiInitialised: boolean = false;
        uiConfig: IUiConfig;

        User: openmaths.User;

        constructor(public Authentication: openmaths.Authentication,
                    private NotificationFactory: openmaths.NotificationFactory,
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

            if (openmaths.User.isSignedIn()) this.User = openmaths.User.getData();
        }

        signIn() {
            if (this.gApiInitialised && !openmaths.User.isSignedIn())
                this.Authentication.gApiLogin(this.signInCallback.bind(this));
        }

        signInCallback(accessToken: string, loginResponse: ILoginResponseData): void {
            let self = this;

            self.User = new openmaths.User(accessToken, loginResponse.userInfo);
            self.NotificationFactory.generate(loginResponse.loginResponse, NotificationType.Info);
        }

        signOut() {
            if (openmaths.User.isSignedIn())
                this.Authentication.gApiLogout(this.signOutCallback.bind(this));
        }

        signOutCallback(): void {
            let self = this;

            self.User.signOut();
            //this.NotificationFactory.generate(loginResponse.loginResponse, NotificationType.Info);
        }
    }

    angular
        .module('openmaths')
        .controller('GlobalController', GlobalController);
}