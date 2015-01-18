(function () {
	"use strict";

	angular
		.module("omApp")
		.controller("GlobalController", GlobalController)
		.constant("magicForGlobal", {
			pageTitle: "Page",
			pageDefaultWelcomeLabel: "dive"
		});

	function GlobalController($scope, $location, $window, notification, omAuth, magicForGlobal) {
		$scope.title = magicForGlobal.pageTitle;

		$scope.siteName = appConfig.siteName;
		$scope.siteLanguage = appConfig.siteLanguage;
		$scope.description = appConfig.description[appConfig.siteLanguage];

		$scope.$watch(function () {
			return $location.path();
		}, function () {
			var splitUrl = $location.url().split("/");
			$scope.path = splitUrl[1] == "" ? magicForGlobal.pageDefaultWelcomeLabel : splitUrl[1];

			// @TODO check if this works properly
			$window.ga("send", "pageview", {
				page: $location.path()
			});
		});

		//$scope.googleSignIn = function () {
		//	if ($scope.omUser) {
		//		return false;
		//	}
		//
		//	gapi.auth.signIn({
		//		"callback": function (authResult) {
		//			if (authResult.status.signed_in) {
		//				omAuth.signIn(authResult, gapi.auth.getToken(), logUserData);
		//			} else {
		//				if (authResult.error !== "immediate_failed") {
		//					notification.generate("There was an error (" + authResult["error"] + ") during the sign in process.", "error");
		//				}
		//			}
		//		}
		//	});
		//};
		//
		//$scope.googleSignOut = function() {
		//	gapi.auth.signOut();
		//
		//	omAuth.signOut({
		//		accessToken: $scope.omUser.accessToken, gPlusId: $scope.omUser.id
		//	}, scrapUserData);
		//};

		var logUserData = function(userData) {
			sessionStorage.setItem("omUser", JSON.stringify(userData));
			$scope.omUser = userData;

			notification.generate("You are now signed in as " + userData.email + ".", "success");
		};

		var scrapUserData = function(success) {
			if (success) {
				sessionStorage.removeItem("omUser");
				$scope.omUser = false;

				// @TODO temp hack
				$scope.$apply(function() {
					notification.generate("You have been successfully signed out.", "info");
				});
			} else {
				notification.generate("There was an error signing you out.", "error");
			}
		};

		// @TODO decide how and where implement
		$scope.setTheme = function (theme) {
			$scope.themeClass = theme;
			localStorage.setItem("themeClass", theme);
		};
		$scope.themeClass = localStorage.getItem("themeClass") ? localStorage.getItem("themeClass") : "light";

		$scope.setUmiFont = function (font) {
			$scope.umiFontClass = font;
			localStorage.setItem("umiFontClass", font);
		};
		$scope.umiFontClass = localStorage.getItem("umiFontClass") ? localStorage.getItem("umiFontClass") : "umi-font-modern";

		if (sessionStorage.getItem("omUser")) {
			var omUserString = sessionStorage.getItem("omUser");
			$scope.omUser = JSON.parse(omUserString);
		}
	}


})();