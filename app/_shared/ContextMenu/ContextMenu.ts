module openmaths {
    'use strict';

    interface IContextMenuScope extends ng.IScope {
        contextMenu: {
            open: boolean;
            posX: number;
            posY: number;
        };
    }

    export class ContextMenuDirective implements ng.IDirective {
        link;
        restrict = 'A';

        constructor() {
            this.link = (scope: IContextMenuScope, ele) => {
                // @TODO
                // write unit test
                ele.addClass('context-menu-container');

                ele.bind('click', e => {
                    e.preventDefault();

                    scope.contextMenu = {
                        open: false,
                        posX: 0,
                        posY: 0
                    };
                    scope.$apply();
                });

                ele.bind('contextmenu', e => {
                    e.preventDefault();

                    scope.contextMenu = {
                        open: true,
                        posX: e.offsetX,
                        posY: e.offsetY
                    };
                    scope.$apply();
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