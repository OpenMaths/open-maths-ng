(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("diveLayout", diveDirective);

	function diveDirective() {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/section.dive/dive.layout.html",
			controller: "SearchController"
		};

		return directive;
	}

})();