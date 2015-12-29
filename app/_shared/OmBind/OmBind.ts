module openmaths {
    'use strict';

    interface IOmBindDirectiveScope extends ng.IScope {
        umi: openmaths.Umi;
        omBind: string;
        disableExpansion: boolean;
    }

    interface IOmBindDirectiveAttributes extends ng.IAttributes {
        omBind: string;
        disableExpansion: boolean;
    }

    export class OmBindDirective implements ng.IDirective {
        link;
        restrict = 'A';
        replace = true;

        constructor($compile:ng.ICompileService) {
            this.link = (scope:IOmBindDirectiveScope, ele, attr:IOmBindDirectiveAttributes) => {
                scope.$watch(attr.omBind, htmlContent => {
                    if (!htmlContent) return false;

                    scope.disableExpansion = !_.isUndefined(attr.disableExpansion);

                    ele.html(htmlContent);
                    $compile(ele.contents())(scope);

                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, ele[0]]);
                });
            };
        }

        static init():ng.IDirectiveFactory {
            return ($compile:ng.ICompileService) => new OmBindDirective($compile);
        }
    }

    angular
        .module('openmaths')
        .directive('omBind', OmBindDirective.init());
}