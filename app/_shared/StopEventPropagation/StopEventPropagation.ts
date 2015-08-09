module openmaths {
    'use strict';

    export class StopEventPropagationDirective implements ng.IDirective {
        link;
        scope = true;
        restrict = 'A';

        constructor() {
            this.link = (scope, ele) => {
                ele.bind('click', (e) => e.stopPropagation());

                scope.$on('$destroy', () => ele.unbind());
            };
        }

        static init(): ng.IDirectiveFactory {
            return () => {
                return new StopEventPropagationDirective();
            };
        }
    }

    angular
        .module('openmaths')
        .directive('stopEventPropagation', StopEventPropagationDirective.init());
}