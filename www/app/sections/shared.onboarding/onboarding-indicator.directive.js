(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("onboardingIndicator", onboardingIndicatorDirective);

	function onboardingIndicatorDirective(onboarding) {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/shared.onboarding/onboarding-indicator.layout.html",
			replace: true,
			scope: {},
			link: linker
		};

		return directive;

		function linker(scope, element, attr) {
			scope.initOnboardingInfo = function() {
				onboarding.generate(attr.section);
			};
		}
	}

})();