module openmaths {
    'use strict';

    interface IResizeRowDirectiveAttributes extends ng.IAttributes {
        minHeight:string;
        rowIndex:string;
    }

    export class ResizeRowDirective implements ng.IDirective {
        link;
        restrict = 'E';

        constructor($document:ng.IDocumentService) {
            this.link = (scope, ele, attrs:IResizeRowDirectiveAttributes) => {
                ele.addClass('resize-row');

                const
                    minHeight = _.parseInt(attrs.minHeight),
                    targetRow = "row-" + attrs.rowIndex;

                let currentMinHeight, startY = 0, y = 0;

                ele.on('mousedown', event => {
                    event.preventDefault();

                    currentMinHeight = document.getElementById(targetRow).style.minHeight ? _.parseInt(document.getElementById(targetRow).style.minHeight) : minHeight;
                    startY = event.pageY;

                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove(event) {
                    y = event.pageY - startY;

                    if ((currentMinHeight + y) > minHeight) {
                        document.getElementById(targetRow).style.minHeight = (currentMinHeight + y) + "px";
                    }
                }

                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }
            }
        }

        static init():ng.IDirectiveFactory {
            return ($document:ng.IDocumentService) => new ResizeRowDirective($document);
        }
    }

    angular
        .module('openmaths')
        .directive('resizeRow', ResizeRowDirective.init());
}