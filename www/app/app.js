var initGapi = function() {
	window.initGapi();
};

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
			}).when("/contribute", {
				templateUrl: _.returnLayout("contribute"),
				controller: "ContributeController"
			});

		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix("!");

		cfpLoadingBarProvider.includeSpinner = false;
	}

})();