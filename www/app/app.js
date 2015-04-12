(function () {
	"use strict";

	angular
		.module("omApp", ["ngRoute", "angular-loading-bar"])
		.config(config)
		.run(run);

	// @TODO resolve .otherwise
	function config($routeProvider, $locationProvider, cfpLoadingBarProvider) {
		$routeProvider
			.when("/", {
				templateUrl: _.returnLayout("dive"),
				controller: "DiveController"
			}).when("/board/:uriFriendlyTitle?", {
				templateUrl: _.returnLayout("board"),
				controller: "BoardController"
			}).when("/contribute", {
				templateUrl: _.returnLayout("contribute"),
				controller: "ContributeController"
			}).when("/edit/:uriFriendlyTitle?", {
				templateUrl: _.returnLayout("edit"),
				controller: "EditController"
			});

		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix("!");

		cfpLoadingBarProvider.includeSpinner = false;
	}

	function run(logger) {
		logger.log("Application omApp is now running", "info");
	}

})();

var initGapiAsync = function () {
	window.initGapi();
};