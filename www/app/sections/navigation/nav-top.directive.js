(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("navTop", navTopDirective); // @TODO rename to nav-top-layout everywhere later

	function navTopDirective($window, notification, omAuth) {
		var directive = {
			restrict: "EA",
			templateUrl: "app/sections/navigation/nav-top.layout.html",
			link: linker
		};

		return directive;

		function linker(scope) {
			$window.initGapi = function() {
				scope.gapiActive = true;
			};

			scope.googleSignIn = function () {
				if (scope.omUser) {
					return false;
				}

				gapi.auth.signIn({
					"callback": function (authResult) {
						console.log(authResult.status); // TEMP | Debug

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

			scope.googleSignOut = function() {
				gapi.auth.signOut();

				omAuth.signOut({
					accessToken: scope.omUser.accessToken, gPlusId: scope.omUser.id
				}, scrapUserData);
			};

			var logUserData = function(userData) {
				sessionStorage.setItem("omUser", JSON.stringify(userData));
				scope.omUser = userData;

				notification.generate("You are now signed in as " + userData.email + ".", "success");
			};

			var scrapUserData = function() {
				sessionStorage.removeItem("omUser");
				scope.omUser = false;

				notification.generate("You have been successfully signed out.", "info");
			};
		}
	}

})();