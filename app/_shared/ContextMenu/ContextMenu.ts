module openmaths {
    'use strict';

    export class ContextMenuDirective implements ng.IDirective {
        link;
        restrict = 'A';

        constructor() {
            this.link = (scope, ele) => {
                ele.bind('contextmenu', e => {
                    e.preventDefault();

                    console.log('X coordinate: ' + e.pageX);
                    console.log('Y coordinate: ' + e.pageY);
                });
            };
        }

        static init(): ng.IDirectiveFactory {
            return () => {
                return new ContextMenuDirective();
            };
        }
    }

    angular
        .module('openmaths')
        .directive('contextMenu', ContextMenuDirective.init());
}