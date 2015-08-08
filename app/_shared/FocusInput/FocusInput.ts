module openmaths {
    'use strict';

    interface IOnClickFocusDirectiveAttributes extends ng.IAttributes {
        focus: boolean;
        onClickFocus: string;
    }

    export class OnClickFocusDirective implements ng.IDirective {
        link;
        scope = true;
        restrict = 'A';

        constructor() {
            this.link = (scope, ele, attr: IOnClickFocusDirectiveAttributes) => {
                let inputSelector = 'input, textarea, select',
                    inputElement = $(ele).find(inputSelector);

                if (attr.focus) inputElement.attr('focus', 'true').focus();

                ele.bind('click focus', (e) => {
                    _.forEach($(ele).siblings(), sibling => $(sibling).find(inputSelector).removeAttr('focus'));

                    inputElement = $(ele).find(inputSelector);

                    if (inputElement.attr('focus') == 'true' && e.type !== 'click') {
                        inputElement.removeAttr('focus');
                        $(ele).prev().focus();
                        return false;
                    }

                    scope.$eval(attr.onClickFocus);
                    scope.$apply();

                    inputElement.attr('focus', 'true').focus();
                });
            };
        }

        static init(): ng.IDirectiveFactory {
            return () => {
                return new OnClickFocusDirective();
            };
        }
    }

    angular
        .module('openmaths')
        .directive('onClickFocus', OnClickFocusDirective.init());
}