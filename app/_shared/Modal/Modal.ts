module openmaths {
    'use strict';

    export class Modal {
        isOpen:boolean;
        title:string;
        data:any;

        constructor(open:boolean, title:string, data?:any) {
            this.isOpen = open;
            this.title = title ? title : 'Untitled';
            this.data = data;
        }
    }

    export class ModalFactory {
        subscriptions:Array<Function> = [];

        subscribe(callback:Function) {
            this.subscriptions.push(callback);
        }

        generate(Modal:Modal) {
            _.forEach(this.subscriptions, callback => {
                callback(Modal);
            });
        }
    }

    angular
        .module('openmaths')
        .service('ModalFactory', ModalFactory);

    export interface IModalDirectiveScope extends ng.IScope {
        Modal:Modal;
    }

    export class ModalDirective implements ng.IDirective {
        link;
        restrict = 'E';
        replace = true;
        scope = {};
        templateUrl = 'app/_shared/Modal/modal.html';

        constructor(private ModalFactory:openmaths.ModalFactory) {
            this.link = (scope:IModalDirectiveScope) => {
                ModalFactory.subscribe((Modal:Modal) => {
                    scope.Modal = Modal;
                });
            };
        }

        static init():ng.IDirectiveFactory {
            return (ModalFactory:openmaths.ModalFactory) =>
                new ModalDirective(ModalFactory);
        }
    }

    angular
        .module('openmaths')
        .directive('modal', ModalDirective.init());
}