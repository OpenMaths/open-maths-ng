module openmaths {
    'use strict';

    interface IFocusInputDirectiveAttributes extends ng.IAttributes {
        focus: boolean;
    }

    export class FocusInputDirective implements ng.IDirective {
        link;
        restrict = 'A';

        constructor() {
            this.link = (scope, ele, attr: IFocusInputDirectiveAttributes) => {
                let input = $(ele).find('input'),
                    textarea = $(ele).find('textarea');

                if (attr.focus) {
                    openmaths.FocusInputDirective.focus(input, textarea);
                }

                ele.click(e => openmaths.FocusInputDirective.focus(input, textarea));
            };
        }

        private static focus(input: JQuery, textarea: JQuery) {
            if (input.length > 0) {
                input.focus();
            } else {
                if (textarea.length > 0) {
                    textarea.focus();
                }
            }
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