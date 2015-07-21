module openmaths {
    'use strict';

    interface IExpandUmiDirectiveScope extends ng.IScope {
        directions: string[];
        expandId: string;
        expandLabel: string;
        //umi: openmaths.Umi;
    }

    interface IExpandUmiAttr extends ng.IAttributes {
        expandId: string;
        expandLabel: string;
        //umi: openmaths.Umi;
    }

    export class ExpandUmiDirective implements ng.IDirective {
        link;
        restrict = 'A';
        scope = {
            //umi: '='
        };
        templateUrl = 'app/_shared/Umi/expandUmi.html';

        constructor() {
            this.link = (scope: IExpandUmiDirectiveScope, ele, attr: IExpandUmiAttr) => {
                scope.$watch('umi.htmlContent', () => {
                    //if (scope.umi.empty) return false;

                    scope.expandId = attr.expandId;
                    scope.expandLabel = attr.expandLabel;
                    scope.directions = ['top', 'right', 'bottom', 'left'];
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