(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("navTopLayout", navTopDirective);

	function navTopDirective($window, notification, omAuth, lStorage) {
		var directive = {
			restrict: "EA",
			templateUrl: "app/sections/navigation/layout.html",
			link: linker
		};

		return directive;

		function linker(scope) {
			$window.initGapi = function () {
				scope.gapiActive = true;
			};

			scope.googleSignIn = function () {
				if (scope.omUser) {
					scope.dropDownUser = scope.dropDownUser ? false : true;
					return false;
				}

				gapi.auth.signIn({
					"callback": function (authResult) {
						if (authResult.status.signed_in == true) {
							omAuth.signIn(authResult, gapi.auth.getToken(), logUserData);
						} else {
							if (authResult.error !== "immediate_failed") {
								notification.generate("There was an error (" + authResult["error"] + ") during the sign in process.", "error");
							}
						}
					}
				});
			};

			scope.googleSignOut = function () {
				gapi.auth.signOut();

				omAuth.signOut({
					accessToken: scope.omUser.accessToken, gPlusId: scope.omUser.id
				}, scrapUserData);
			};

			var logUserData = function (userData) {
				sessionStorage.setItem("omUser", JSON.stringify(userData));
				scope.omUser = userData;

				notification.generate("You are now signed in as " + userData.email + ".", "success");
			};

			var scrapUserData = function () {
				sessionStorage.removeItem("omUser");
				scope.omUser = false;

				notification.generate("You have been successfully signed out.", "info");
			};

			scope.setUI = function (type, value) {
				var uiSettings = scope.uiSettings;

				switch (type) {
					case "font":
						uiSettings.font = value;
						break;
					case "theme":
						uiSettings.theme = value;
						break;
				}

				lStorage.set("uiSettings", uiSettings);
				scope.uiSettings = uiSettings;
			};
		}
	}

})();