/// <reference path="../../_ref.ts" />

//module openmaths {
//	'use strict';
//
//	export interface HomeControllerScope extends ng.IScope {
//		greeting: string;
//		changeName(name: string): void;
//	}
//
//	export class HomeController {
//		constructor($scope: HomeControllerScope, Api: openmaths.Api) {
//			$scope.greeting = 'Hello World';
//			$scope.changeName = (name) => {
//				$scope.greeting = 'Hello' + name;
//			};
//
//			console.log(Api.get("https://api.github.com/users/slavomirvojacek/repos"));
//		}
//	}
//
//	angular
//		.module('openmaths')
//		.controller('HomeController', HomeController);
//}