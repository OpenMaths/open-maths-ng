module openmaths {
    'use strict';

    interface IUmiDirectiveScope extends ng.IScope {
        umi: Umi;
    }

    interface IUmiAttr extends ng.IAttributes {
    }

    export class UmiPositionDirective implements ng.IDirective {
        link;
        restrict = 'A';
        scope = true;

        constructor($window:angular.IWindowService, $timeout:angular.ITimeoutService) {
            this.link = (scope:IUmiDirectiveScope, ele, attr:IUmiAttr) => {
                // @TODO document why the fuck this fucking hack is needed
                $timeout(assignCorrectBoundaries, 1000);

                Rx.Observable.fromEvent($window, 'resize')
                    .debounce(1000)
                    .map(d => true)
                    .subscribe(() => {
                        assignCorrectBoundaries();
                    });

                function assignCorrectBoundaries() {
                    const width = ele.width(), height = ele.height(),
                        offsetTop = ele.prop('offsetTop'), offsetLeft = ele.prop('offsetLeft');

                    scope.umi.boundary = new UmiBoundary(offsetLeft, offsetLeft + width, offsetTop, offsetTop + height);
                    openmaths.Logger.debug('Setting new UMI boundary');
                }
            };
        }

        static init():ng.IDirectiveFactory {
            return ($window:angular.IWindowService, $timeout:angular.ITimeoutService) => {
                return new UmiPositionDirective($window, $timeout);
            };
        }
    }

    angular
        .module('openmaths')
        .directive('umiPosition', UmiPositionDirective.init());
}