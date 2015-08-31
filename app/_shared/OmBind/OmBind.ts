module openmaths {
    'use strict';

    interface IOmBindDirectiveScope extends ng.IScope {
        umi: openmaths.Umi;
        omBind: string;
    }

    interface IOmBindDirectiveAttributes extends ng.IAttributes {
        omBind: string;
    }

    export class OmBindDirective implements ng.IDirective {
        link;
        restrict = 'A';
        replace = true;

        constructor($compile: ng.ICompileService) {
            this.link = (scope: IOmBindDirectiveScope, ele, attr) => {
                scope.$watch(attr.omBind, htmlContent => {
                    if (!htmlContent) return false;

                    ele.html(htmlContent);
                    $compile(ele.contents())(scope);

                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, ele[0]]);
                });
            };
        }

        static init(): ng.IDirectiveFactory {
            return ($compile: ng.ICompileService) => new OmBindDirective($compile);
        }
    }

    angular
        .module('openmaths')
        .directive('omBind', OmBindDirective.init());
}