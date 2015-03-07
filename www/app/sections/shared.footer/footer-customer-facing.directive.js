(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("footerLayoutCustomerFacing", footerCustomerFacingDirective);

	function footerCustomerFacingDirective() {
		var directive = {
			restrict: "A",
			templateUrl: "app/sections/shared.footer/customer-facing.layout.html"
		};

		return directive;
	}

})();