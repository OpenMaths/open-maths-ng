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
				font: "umi-font-modern",
				remember: {
					boardLayout: true
				}
			}
		})
		.constant("magic", {
			siteName: "OpenMaths",
			siteLanguage: "en",
			description: "The way Mathematics should be done.",
			css: _.getCSSPath(),
			api: _.getApiUrl(),
			debug: _.getDebug(),
			year: new Date().getFullYear()
		});

	function GlobalController($scope, $location, lStorage, sStorage, googleAnalytics, logger, magic, magicForGlobal) {
		$scope.title = magicForGlobal.pageTitle;

		$scope.siteName = magic.siteName;
		$scope.siteLanguage = magic.siteLanguage;
		$scope.description = magic.description;
		$scope.year = magic.year;

		$scope.cssPath = magic.css;
		$scope.uiSettings = lStorage.get("uiSettings") ? lStorage.get("uiSettings") : magicForGlobal.uiSettingsDefault;

		$scope.setUI = function (type, value) {
			type = type.toLowerCase();
			value = value.toLowerCase();

			switch (type) {
				case "font":
					$scope.uiSettings.font = value;
					break;
				case "theme":
					$scope.uiSettings.theme = value;
					break;
				case "remember":
					$scope.uiSettings.remember[value] = $scope.uiSettings.remember[value] ? false : true;
					break;
				default:
					return false;
			}

			lStorage.set("uiSettings", $scope.uiSettings);
		};

		$scope.$watch(function () {
			return $location.path();
		}, runOnLocationChange);

		function runOnLocationChange() {
			var splitUrl = $location.url().split("/");

			$scope.path = splitUrl[1] == "" ? magicForGlobal.pageDefaultWelcomeLabel : splitUrl[1];
			$scope.omUser = sStorage.get("omUser");
			$scope.gapiActive = sStorage.get("gapiActive");

			if (!magic.debug) {
				googleAnalytics.sendPageView($location.path());
			} else {
				logger.log("Current Location: " + $scope.path, "info");
			}
		}
	}

})();