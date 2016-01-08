module openmaths {
    'use strict';

    export interface IGlobalControllerWindow extends ng.IWindowService {
        gApiInitialised: () => void;
    }

    interface IRedirectUrl {
        name:string;
        params: {
            uriFriendlyTitle:string;
        }
    }

    export class GlobalController {
        private static signedInNotificationMessage = 'You have been successfully signed in to OpenMaths';
        private static signedOutNotificationMessage = 'You have been signed out';

        bodyClass:string;
        staticUrl:string;
        uiConfig:IUiConfig;

        User:openmaths.User;

        constructor(public Authentication:openmaths.Authentication,
                    private NotificationFactory:openmaths.NotificationFactory,
                    private ModalFactory:openmaths.ModalFactory,
                    private $rootScope:ng.IRootScopeService,
                    private $state:ng.ui.IStateService,
                    private $window:IGlobalControllerWindow) {
            $window.gApiInitialised = () => {
                openmaths.SessionStorage.set('gApiInitialised', true);
                openmaths.Logger.debug('gApi successfully initialised');
            };

            $rootScope.$on('$stateChangeSuccess', (e, toState) => {
                this.uiConfig = openmaths.Config.getUiConfig();
                this.uiConfig.currentState = toState.uiConfig;

                this.bodyClass = this.uiConfig.currentState.bodyClass;
            });

            if (openmaths.User.isSignedIn()) this.User = openmaths.User.getData();

            this.staticUrl = openmaths.Config.getStaticUrl();

            key('escape', () => {
                ModalFactory.generate(new Modal(false, ''));
                $rootScope.$apply();
            });
        }

        toggleFont() {
            this.uiConfig.font = (this.uiConfig.font == 'traditional' ? 'modern' : 'traditional');
            LocalStorage.set('uiConfig', this.uiConfig);
        }

        toggleTheme() {
            this.uiConfig.theme = (this.uiConfig.theme == 'dark' ? 'light' : 'dark');
            LocalStorage.set('uiConfig', this.uiConfig);
        }

        signIn() {
            if (openmaths.SessionStorage.get('gApiInitialised') && !openmaths.User.isSignedIn())
                this.Authentication.gApiLogin(this.signInCallback.bind(this));
        }

        signInCallback(accessToken:string, loginResponse:ILoginResponseData):void {
            let self = this;

            self.User = new openmaths.User(accessToken, loginResponse.userInfo);
            self.NotificationFactory.generate(GlobalController.signedInNotificationMessage, NotificationType.Info);

            const redirectUrl:IRedirectUrl = SessionStorage.get('redirectUrl');

            if (redirectUrl) {
                this.$state.go(redirectUrl.name, {uriFriendlyTitle: redirectUrl.params.uriFriendlyTitle});
            }
        }

        signOut() {
            if (openmaths.User.isSignedIn())
                this.Authentication.gApiLogout(this.signOutCallback.bind(this));

            this.$state.go('explore');
        }

        signOutCallback():void {
            let self = this;

            self.User.signOut();
            self.NotificationFactory.generate(GlobalController.signedOutNotificationMessage, NotificationType.Info);
        }
    }

    angular
        .module('openmaths')
        .controller('GlobalController', GlobalController);
}