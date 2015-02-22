(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("navTopLayoutCustomerFacing", navTopCustomerFacingDirective);

	function navTopCustomerFacingDirective() {
		var directive = {
			restrict: "A",
			templateUrl: "app/sections/shared.navigation/customer-facing.layout.html",
			scope: true
		};

		return directive;
	}

})();