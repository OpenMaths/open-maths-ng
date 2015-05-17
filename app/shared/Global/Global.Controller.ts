module openmaths {
    'use strict';

    export interface IGlobalControllerScope extends ng.IScope {
        bodyClass: string;
    }

    export class GlobalController {
        constructor($scope: IGlobalControllerScope, $rootScope: ng.IRootScopeService) {
            $rootScope.$on('$stateChangeSuccess', (e, toState) => {
                let states: Array<string> = toState.name.split(".");

                $scope.bodyClass = "page-" + _.first(states);
            });
        }
    }

    angular
        .module('openmaths')
        .controller('GlobalController', GlobalController);
}