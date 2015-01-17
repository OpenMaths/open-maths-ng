(function() {
	"use strict";

	angular
		.module("omApp")
		.directive("navTop", navTopDirective);

	function navTopDirective() {
		var directive = {
			restrict: "EA",
			templateUrl: "app/sections/section.global/nav-top.layout.html"
		};

		return directive;
	}

})();