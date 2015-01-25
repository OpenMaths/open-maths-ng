(function () {
	"use strict";

	angular
		.module("omApp")
		.controller("GlobalController", GlobalController)
		.constant("magicForGlobal", {
			pageTitle: "Page",
			pageDefaultWelcomeLabel: "dive",
			uiSettingsDefault: {
				theme: "light",
				font: "umi-font-modern"
			}
		})
		.constant("magic", {
			siteName: "OpenMaths",
			siteLanguage: "en",
			description: "The way Mathematics should have been done.",
			css: _.getCSSPath(),
			api: _.getApiUrl(),
			debug: _.getDebug()
		});

	function GlobalController($scope, $location, $window, lStorage, sStorage, logger, magic, magicForGlobal) {
		$scope.title = magicForGlobal.pageTitle;

		$scope.siteName = magic.siteName;
		$scope.siteLanguage = magic.siteLanguage;
		$scope.description = magic.description;

		$scope.$watch(function () {
			return $location.path();
		}, runOnLocationChange);

		function runOnLocationChange() {
			var splitUrl = $location.url().split("/");

			$scope.path = splitUrl[1] == "" ? magicForGlobal.pageDefaultWelcomeLabel : splitUrl[1];

			$scope.omUser = sStorage.get("omUser");
			$scope.gapiActive = sStorage.get("gapiActive");

			logger.log("Current location: " + $location.path(), "info");

			// @TODO check if this works properly, would be better to create a directive I think
			$window.ga("send", "pageview", {
				page: $location.path()
			});
		}

		$scope.cssPath = magic.css;
		$scope.uiSettings = lStorage.get("uiSettings") ? lStorage.get("uiSettings") : magicForGlobal.uiSettings;
	}

})();