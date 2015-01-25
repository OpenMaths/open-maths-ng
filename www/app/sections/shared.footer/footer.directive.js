(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("footerLayout", footerDirective);

	function footerDirective() {
		var directive = {
			restrict: "A",
			templateUrl: "app/sections/shared.footer/layout.html"
		};

		return directive;
	}

})();