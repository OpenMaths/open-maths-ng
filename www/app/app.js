(function() {
	"use strict";

	angular
		.module("omApp", ["ngRoute", "angular-loading-bar"])
		.config(config)
		.run();

	function config($routeProvider, $locationProvider, cfpLoadingBarProvider) {
		$routeProvider
			.when("/", {
				templateUrl: _.returnLayout("dive"),
				controller: "DiveController",
				controllerAs: "vm"
			}).when("/board/:id", {
				templateUrl: _.returnLayout("board"),
				controller: "BoardController"
			});

		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix("!");

		cfpLoadingBarProvider.includeSpinner = false;
	}

})();