(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("navTopLayout", navTopDirective)
		.constant("magicForNacTopDirective", {
			shakeDiveInSearchTimeout: 550
		});

	function navTopDirective($window, $timeout, userLevel, notification, omAuth, logger, sStorage, magicForNacTopDirective) {
		var directive = {
			restrict: "A",
			templateUrl: "app/sections/shared.navigation/layout.html",
			scope: true,
			link: linker
		};

		return directive;

		function linker(scope) {
			//$window.initGapi = function () {
			//	scope.$apply(function() {
			//		scope.gapiActive = sStorage.set("gapiActive", {status: "active"});
			//	});
			//};


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
							var signInError = authResult.error;

							if (signInError !== "immediate_failed" && signInError !== "user_signed_out") {
								notification.generate("There was an error (" + signInError + ") during the sign in process.", "error");
							} else {
								logger.log(signInError, "debug");
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
				sStorage.set("omUser", userData);
				scope.omUser = userData;

				notification.generate("You are now signed in as " + userData.email + ".", "success");
			};

			var scrapUserData = function () {
				sStorage.remove("omUser");
				scope.omUser = false;

				notification.generate("You have been successfully signed out.", "info");
			};

			scope.accessUserLevel = function (url) {
				// @TODO does this need to be a return?
				return userLevel.access(url);
			};

			scope.accessBoard = function() {
				if (scope.path !== "board") {
					scope.$parent.shakeDiveInSearch = true;
					$timeout(function() {
						scope.$parent.shakeDiveInSearch = false;
					}, magicForNacTopDirective.shakeDiveInSearchTimeout);

					notification.generate("Use our search to navigate to this section :-)", "info");
				}

				return false;
			};
		}
	}

})();