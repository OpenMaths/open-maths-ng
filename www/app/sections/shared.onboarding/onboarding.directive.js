(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("onboardingLayout", onboardingDirective)
		.constant("magicForOnboardingDirective", {
			popUpAppearTimeout: 50,
			popUpDisappearTimeout: 500
		});

	function onboardingDirective($timeout, lStorage, onboarding, magicForOnboardingDirective) {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/shared.onboarding/layout.html",
			replace: true,
			scope: {
				onboarding: "=onboarding"
			},
			link: linker
		};

		return directive;

		function linker(scope) {
			onboarding.subscribe(function (onboardingData) {
				scope.data = onboardingData;

				$timeout(function () {
					scope.act = true;
				}, magicForOnboardingDirective.popUpAppearTimeout);

				scope.hide = function () {
					var onboardingCache = lStorage.get("onboarding") ? lStorage.get("onboarding") : {};

					onboardingCache[onboardingData.section] = true;
					scope.onboarding[onboardingData.section] = true;
					lStorage.set("onboarding", onboardingCache);

					scope.act = false;

					$timeout(function () {
						scope.data = false;
					}, magicForOnboardingDirective.popUpDisappearTimeout);
				};
			});
		}
	}

})();