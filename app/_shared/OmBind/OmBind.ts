module openmaths {
    'use strict';

    interface IOmBindDirectiveScope extends ng.IScope {
        umi: openmaths.Umi
    }

    export class OmBindDirective implements ng.IDirective {
        link;
        restrict = 'A';
        replace = true;
        scope = false;

        constructor($compile: ng.ICompileService) {
            this.link = (scope: IOmBindDirectiveScope, ele) => {
                scope.$watch('umi.htmlContent', htmlContent => {
                    if (scope.umi.empty) return false;

                    ele.html(htmlContent);
                    $compile(ele.contents())(scope);

                    // @TODO
                    // implement MathJax
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, ele[0]]);
                });
            };
        }

        static init(): ng.IDirectiveFactory {
            return ($compile: ng.ICompileService) => {
                return new OmBindDirective($compile);
            };
        }
    }

    angular
        .module('openmaths')
        .directive('omBind', OmBindDirective.init());
}