module openmaths {
    'use strict';

    export class NavigationFactory {
    }

    export interface INavigationDirectiveScope extends ng.IScope {
        //config: ng.ui.IUiConfig;
        //currentState: string;
        //ui: ng.ui.IUiNavigationConfig;
    }

    angular
        .module('openmaths')
        .service('NavigationFactory', NavigationFactory);

    export class NavigationDirective implements ng.IDirective {
        restrict = 'E';
        templateUrl = 'app/shared/Navigation/navigation.html';
        scope = {
            config: '='
        };
        replace = true;
        link;

        constructor(private NavigationFactory: openmaths.NavigationFactory) {
            this.link = (scope: INavigationDirectiveScope) => {
                //scope.ui = scope.config.navigation;
                //console.log(scope);
                //scope.hidingOn = true;
                //scope.transparent = true;
                //NotificationFactory.subscribe((notificationData) => {
                //scope.notification = notificationData;
                //scope.act = true;
                //});
            };
        }

        static init(): ng.IDirectiveFactory {
            return (NavigationFactory: openmaths.NavigationFactory) => {
                return new NavigationDirective(NavigationFactory);
            };
        }
    }

    angular
        .module('openmaths')
        .directive('navigation', NavigationDirective.init());
}