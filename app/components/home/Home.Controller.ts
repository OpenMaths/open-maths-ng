/// <reference path="../../_ref.ts" />

module openmaths {
	'use strict';

	export interface HomeControllerScope extends ng.IScope {
		name: string;
		changeName(name: string): void;
	}

	export class HomeController {
		constructor($scope: HomeControllerScope, Api: openmaths.Api) {
			$scope.name = 'Test';

			$scope.changeName = (name) => {
				$scope.name = name;
			};

			console.log(Api.get("https://api.github.com/users/slavomirvojacek/repos"));
		}
	}

	angular
		.module('openmaths')
		.controller('HomeController', HomeController);
}