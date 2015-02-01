(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("onboarding", onboardingFactory)
		.constant("magicForOnboardingFactory", {
			"dive": {
				title: "Dive Into Mathematics",
				message: "Search results will appear as you type. You can easily navigate <strong>using arrow keys and pressing Enter</strong>, or simply using your mouse or track pad."
			},
			"settings": {
				title: "Make yourself at home :-)",
				message: "We know that you like to play around and so we offer a dark version of the platform, as well as an option to swap our default font for the traditional Times New Roman font face in definitions."
			},
			"profile": {
				title: "Create content",
				message: "A Google Account. <strong>That is all you need</strong> to use OpenMaths to generate content and contribute."
			}
		});

	function onboardingFactory($sce, magicForOnboardingFactory) {
		var subscriptions = [];

		return {
			subscribe: subscribe,
			generate: generate
		};

		function subscribe(callback) {
			subscriptions.push(callback);
		}

		function generate(onboardingSection) {
			var data = {
				title: magicForOnboardingFactory[onboardingSection].title,
				message: $sce.trustAsHtml(magicForOnboardingFactory[onboardingSection].message),
				section: onboardingSection
			};

			_.forEach(subscriptions, function (callback) {
				callback(data);
			});
		}

	}

})();