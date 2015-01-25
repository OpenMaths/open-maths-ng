(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("diveLayout", diveDirective);

	function diveDirective($location, notification) {
		var directive = {
			restrict: "EA",
			templateUrl: "app/sections/section.dive/dive.layout.html",
			link: linker,
			controller: "SearchController"
		};

		return directive;

		function linker(scope) {
			scope.getUmi = function (uri) {
				if (!uri) {
					notification.generate("No URI argument present", "error");

					return false;
				}

				$location.path("/board/" + uri);
			};
		}
	}

})();