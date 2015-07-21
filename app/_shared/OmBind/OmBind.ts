module openmaths {
    'use strict';

    export interface IOmBindDirectiveScope extends ng.IScope {
        umi: openmaths.Umi
    }

    export class OmBindDirective implements ng.IDirective {
        restrict = 'A';
        scope = {
            umi: '='
        };
        replace = true;
        link;

        constructor($compile: ng.ICompileService) {
            this.link = (scope: IOmBindDirectiveScope, ele) => {
                scope.$watch('umi.htmlContent', html => {
                    if (scope.umi.empty) return false;

                    ele.html(html);
                    $compile(ele.contents())(scope);

                    // @TODO
                    // implement MathJax
                    //MathJax.Hub.Queue(["Typeset", MathJax.Hub, ele[0]]);
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