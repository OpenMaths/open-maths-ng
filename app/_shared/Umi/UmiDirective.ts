module openmaths {
    'use strict';

    interface IUmiDirectiveScope extends ng.IScope {
        umi: Umi;
    }

    interface IUmiAttr extends ng.IAttributes {
    }

    export class UmiDirective implements ng.IDirective {
        link;
        restrict = 'A';
        scope = true;

        constructor() {
            this.link = (scope:IUmiDirectiveScope, ele, attr:IUmiAttr) => {
                //console.log(ele.width());
                scope.$watch('umi.htmlContent', () => {
                    if (scope.umi.empty) return false;

                    const width = ele.width();
                    const height = ele.height();

                    const offsetTop = ele.prop('offsetTop');
                    const offsetLeft = ele.prop('offsetLeft');

                    const widthBegin = offsetLeft;
                    const widthFinish = offsetLeft + width;

                    const heightBegin = offsetTop;
                    const heightFinish = offsetTop + height;

                    console.debug(widthBegin, widthFinish);
                    console.debug(heightBegin, heightFinish);
                });
            };
        }

        static init():ng.IDirectiveFactory {
            return () => {
                return new UmiDirective();
            };
        }
    }

    angular
        .module('openmaths')
        .directive('umiPosition', UmiDirective.init());
}