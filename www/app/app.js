(function () {
	"use strict";

	angular
		.module("omApp", ["ngRoute", "angular-loading-bar"])
		.config(config)
		.run(run);

	function config($routeProvider, $locationProvider, cfpLoadingBarProvider) {
		$routeProvider
			.when("/", {
				templateUrl: _.returnLayout("dive"),
				controller: "DiveController"
			}).when("/is", {
				templateUrl: _.returnLayout("about"),
				controller: "AboutController"
			}).when("/board/:uriFriendlyTitle?", {
				templateUrl: _.returnLayout("board"),
				controller: "BoardController"
			}).when("/contribute", {
				templateUrl: _.returnLayout("contribute"),
				controller: "ContributeController"
			}).when("/edit/:umiID?", {
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
	_.delay(function() {
		window.initGapi();
	}, 100);
};