(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("navTop", navTopDirective); // @TODO rename to nav-top-layout everywhere later

	function navTopDirective($window) {
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

			scope.googleSignIn = function() {alert("ok!");};
		}
	}

})();