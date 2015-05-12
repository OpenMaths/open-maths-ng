/// <reference path="../../_ref.ts" />

module openmaths {
    'use strict';

    export interface IGlobalControllerScope extends ng.IScope {
        bodyClass: string;
    }

    export class GlobalController {
        constructor($scope: IGlobalControllerScope, $rootScope: ng.IRootScopeService) {
            $rootScope.$on('$stateChangeSuccess', function (e, toState) {
                var states: Array<string> = toState.name.split(".");

                $scope.bodyClass = "page-" + _.first(states);
            });
        }
    }

    angular
        .module('openmaths')
        .controller('GlobalController', GlobalController);
}