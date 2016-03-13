module openmaths {
    'use strict';

    export class NavigationFactory {
    }

    export interface INavigationDirectiveScope extends ng.IScope {
        GlobalCtr: openmaths.GlobalController;
        visible: boolean;
    }

    angular
        .module('openmaths')
        .service('NavigationFactory', NavigationFactory);

    export class NavigationDirective implements ng.IDirective {
        link;
        restrict = 'E';
        replace = true;
        templateUrl = 'app/_shared/Navigation/navigation.html';

        constructor(private $timeout:ng.ITimeoutService) {
            this.link = (scope:INavigationDirectiveScope, ele) => {
                let timer;

                ele.bind('mouseover', () => {
                    scope.visible = true;
                    scope.$apply();

                    $timeout.cancel(timer);
                });

                ele.bind('mouseout', () => {
                    timer = $timeout(() => {
                        scope.visible = false;
                        // @TODO abstract into private magic var
                    }, 900);
                });
            };
        }

        static init():ng.IDirectiveFactory {
            return ($timeout:ng.ITimeoutService) => {
                return new NavigationDirective($timeout);
            };
        }
    }

    angular
        .module('openmaths')
        .directive('navigation', NavigationDirective.init());
}