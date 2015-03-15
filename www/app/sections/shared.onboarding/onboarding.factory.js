(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("onboarding", onboardingFactory);

	function onboardingFactory($sce, $http) {
		var subscriptions = [];

		return {
			subscribe: subscribe,
			generate: generate
		};

		function subscribe(callback) {
			subscriptions.push(callback);
		}

		function generate(onboardingSection) {
			$http.get("app/sections/shared.onboarding/onboarding.content.json").success(function(d) {
				var data = d[onboardingSection];
				data.message = $sce.trustAsHtml(data.message);
				data.section = onboardingSection;

				_.forEach(subscriptions, function (callback) {
					callback(data);
				});
			}).error(function(e) {
				console.log(e);
			});
		}

	}

})();