module openmaths {
    'use strict';

    export class FocusInputDirective implements ng.IDirective {
        link;
        restrict = 'A';

        constructor() {
            this.link = (scope, ele) => {
                ele.click(e => {
                    let input = $(e.currentTarget).find('input');

                    input.focus();
                });
            };
        }

        static init(): ng.IDirectiveFactory {
            return () => {
                return new FocusInputDirective();
            };
        }
    }

    angular
        .module('openmaths')
        .directive('focusInput', FocusInputDirective.init());
}