module openmaths {
    'use strict';

    export interface IDiveControllerScope extends ng.IScope {
        items: Array<string>;
    }

    export class DiveController {
        constructor(private $scope: IDiveControllerScope) {
            $scope.items = ['Item 1', 'Item 2'];
        }
    }

    angular
        .module('openmaths')
        .controller('DiveController', DiveController);
}