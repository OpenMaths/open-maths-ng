module openmaths {
    'use strict';

    export class DiveController {
        items: Array<string>;

        constructor() {
            this.items = ['Item 1', 'Item 2'];
        }
    }

    angular
        .module('openmaths')
        .controller('DiveController', DiveController);
}