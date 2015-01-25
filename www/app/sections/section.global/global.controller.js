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
		}, function () {
			var splitUrl = $location.url().split("/");

			$scope.path = splitUrl[1] == "" ? magicForGlobal.pageDefaultWelcomeLabel : splitUrl[1];

			$scope.omUser = sStorage.get("omUser");
			$scope.gapiActive = sStorage.get("gapiActive");

			logger.log("Current location: " + $location.path(), "info");

			// @TODO check if this works properly, will have to create a directive I think
			$window.ga("send", "pageview", {
				page: $location.path()
			});
		});

		$scope.uiSettings = lStorage.get("uiSettings") ? lStorage.get("uiSettings") : magicForGlobal.uiSettings;
	}


})();