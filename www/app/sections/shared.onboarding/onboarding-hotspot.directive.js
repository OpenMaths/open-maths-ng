(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("onboardingHotspot", onboardingHotspotDirective);

	function onboardingHotspotDirective(onboarding) {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/shared.onboarding/onboarding-hotspot.layout.html",
			replace: true,
			scope: {},
			link: linker
		};

		return directive;

		function linker(scope, element, attr) {
			var section = attr.section;

			scope.initOnboardingInfo = function() {
				onboarding.generate(section);
			};
		}
	}

})();