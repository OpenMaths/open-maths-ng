module openmaths {
    'use strict';

    export class NavigationFactory {
    }

    export interface INavigationDirectiveScope extends ng.IScope {
        config: IUiConfig;
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