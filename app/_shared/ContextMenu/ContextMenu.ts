module openmaths {
    'use strict';

    export class ContextMenuDirective implements ng.IDirective {
        link;
        restrict = 'A';

        constructor() {
            this.link = (scope, ele) => {
                ele.bind('contextmenu', e => {
                    alert('You\'ve tried to open context menu');
                    e.preventDefault();
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