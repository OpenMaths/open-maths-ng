module openmaths {
    'use strict';

    export class ScrollDirective implements ng.IDirective {
        link;
        scope = {observe: '='};
        restrict = 'A';

        constructor() {
            this.link = (scope, ele) => {
                $(ele).perfectScrollbar({
                    suppressScrollX: false
                });

                scope.$watch('observe', () => {
                    ele.scrollTop = 0;
                    $(ele).perfectScrollbar('update');
                });
            };
        }

        static init():ng.IDirectiveFactory {
            return () => {
                return new ScrollDirective();
            };
        }
    }

    angular
        .module('openmaths')
        .directive('scroll', ScrollDirective.init());
}