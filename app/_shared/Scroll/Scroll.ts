module openmaths {
    'use strict';

    export class ScrollDirective implements ng.IDirective {
        link;
        restrict = 'A';

        constructor() {
            this.link = (scope, ele) => {
                $(ele).perfectScrollbar({
                    suppressScrollX: true
                });
            };
        }

        static init(): ng.IDirectiveFactory {
            return () => {
                return new ScrollDirective();
            };
        }
    }

    angular
        .module('openmaths')
        .directive('scroll', ScrollDirective.init());
}