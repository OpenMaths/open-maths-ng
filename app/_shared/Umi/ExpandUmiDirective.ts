module openmaths {
    'use strict';

    interface IExpandUmiDirectiveScope extends ng.IScope {
        directions: string[];
        label: string;
        umi: openmaths.Umi;
    }

    interface IExpandUmiAttr extends ng.IAttributes {
        label: string;
    }

    export class ExpandUmiDirective implements ng.IDirective {
        link;
        restrict = 'A';
        scope = {
            umi: '='
        };
        templateUrl = 'app/_shared/Umi/expandUmi.html';

        constructor() {
            this.link = (scope: IExpandUmiDirectiveScope, ele, attr: IExpandUmiAttr) => {
                scope.$watch('umi.htmlContent', () => {
                    if (scope.umi.empty) return false;

                    scope.directions = ['top', 'right', 'bottom', 'left'];
                    scope.label = attr.label;
                });
            };
        }

        static init(): ng.IDirectiveFactory {
            return () => {
                return new ExpandUmiDirective();
            };
        }
    }

    angular
        .module('openmaths')
        .directive('expandUmi', ExpandUmiDirective.init());
}