(function() {
	"use strict";

	angular
		.module("omApp")
		.controller("GlobalController", GlobalController);

	function GlobalController($scope, $location, $window) {
		$scope.title = "Page";
		$scope.siteName = appConfig.siteName;
		$scope.siteLanguage = appConfig.siteLanguage;
		$scope.description = appConfig.description[appConfig.siteLanguage];

		$scope.$watch(function () {
			return $location.path();
		}, function() {
			var splitUrl = $location.url().split("/");
			$scope.path = splitUrl[1] == "" ? "dive" : splitUrl[1];

			// @TODO check if this works properly
			$window.ga("send", "pageview", {page: $location.path()});
		});
	}


})();