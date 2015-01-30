(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("googleAnalytics", gaFactory);

	function gaFactory($window, logger) {
		var factory = {
			sendPageView: sendPageView
		};

		return factory;

		function sendPageView(location) {
			$window.ga("send", "pageview", {
				page: location
			});

			logger.log("GA Sent: " + location, "info");
		}
	}

})();