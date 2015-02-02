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
				message: "For the more artful, we created a <strong>subtler - dark version</strong> of the platform. You can also set the definition font to <strong>Times New Roman</strong> found in most books."
			},
			"contribute": {
				title: "Create content",
				message: "A Google Account. <strong>That is all you need</strong> to use OpenMaths to generate content and contribute."
			},
			"manageBoard": {
				title: "Manage your board",
				message: "Use the plus and minus indicators to <strong>manage rows and columns</strong>. We remember your preferences by default, but you can always disable it."
			},
			"resizeBoardRows": {
				title: "Resize and adapt",
				message: "Feel free to <strong>play around with the grid</strong>! Whether you are running out of space, or you simply want to customise the way it looks."
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