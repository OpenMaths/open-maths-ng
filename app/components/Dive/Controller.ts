module openmaths {
	'use strict';

	export interface IDiveControllerScope extends ng.IScope {
		items: Array<string>;
	}

	export class DiveController {
		private scope: IDiveControllerScope;

		constructor($scope) {
			this.scope = $scope;

			this.scope.items = ['Item 1', 'Item 2'];
		}
	}

	angular
		.module('openmaths')
		.controller('DiveController', DiveController);
}