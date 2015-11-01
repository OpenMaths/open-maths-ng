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

        constructor($window:angular.IWindowService) {
            this.link = (scope:IUmiDirectiveScope, ele, attr:IUmiAttr) => {
                assignCorrectBoundaries();

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
            return ($window:angular.IWindowService) => {
                return new UmiPositionDirective($window);
            };
        }
    }

    angular
        .module('openmaths')
        .directive('umiPosition', UmiPositionDirective.init());
}