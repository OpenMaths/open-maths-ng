(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("contributeLayout", contributeDirective);

	function contributeDirective() {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/section.contribute/contribute.layout.html"
		};

		return directive;
	}

})();