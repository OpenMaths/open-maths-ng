/// <reference path="../../_ref.ts" />

module openmaths {
	'use strict';

	export interface DiveControllerScope extends ng.IScope {
		items: Array<string>;
	}

	export class DiveController {
		private scope: DiveControllerScope;

		constructor($scope) {
			this.scope = $scope;

			this.scope.items = ['Item 1', 'Item 2'];
		}
	}

	angular
		.module('openmaths')
		.controller('DiveController', DiveController);
}