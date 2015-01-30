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
			description: "The way Mathematics should be done.",
			css: _.getCSSPath(),
			api: _.getApiUrl(),
			debug: _.getDebug()
		});

	function GlobalController($scope, $location, lStorage, sStorage, magic, magicForGlobal) {
		$scope.title = magicForGlobal.pageTitle;

		$scope.siteName = magic.siteName;
		$scope.siteLanguage = magic.siteLanguage;
		$scope.description = magic.description;

		$scope.cssPath = magic.css;
		$scope.uiSettings = lStorage.get("uiSettings") ? lStorage.get("uiSettings") : magicForGlobal.uiSettingsDefault;

		$scope.$watch(function () {
			return $location.path();
		}, runOnLocationChange);

		function runOnLocationChange() {
			var splitUrl = $location.url().split("/");

			$scope.path = splitUrl[1] == "" ? magicForGlobal.pageDefaultWelcomeLabel : splitUrl[1];
			$scope.omUser = sStorage.get("omUser");
			$scope.gapiActive = sStorage.get("gapiActive");
		}
	}

})();