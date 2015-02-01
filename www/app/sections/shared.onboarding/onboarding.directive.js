(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("onboardingLayout", onboardingDirective)
		.constant("magicForOnboardingDirective", {
			popUpAppearTimeout: 50,
			popUpDisappearTimeout: 500
		});

	function onboardingDirective($timeout, onboarding, magicForOnboardingDirective) {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/shared.onboarding/layout.html",
			replace: true,
			scope: {},
			link: linker
		};

		return directive;

		function linker(scope) {
			onboarding.subscribe(function (popUpData) {
				scope.data = popUpData;

				$timeout(function () {
					scope.act = true;
				}, magicForOnboardingDirective.popUpAppearTimeout);

				scope.hide = function() {
					scope.act = false;

					$timeout(function () {
						scope.data = false;
					}, magicForOnboardingDirective.popUpDisappearTimeout);
				};
			});
		}
	}

})();