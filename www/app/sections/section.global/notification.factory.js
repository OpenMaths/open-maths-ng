(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("notification", notificationFactory);

	function notificationFactory($log) {
		var subscriptions = [];

		return {
			subscribe: subscribe,
			generate: generate
		};

		function subscribe(callback) {
			subscriptions.push(callback);
		}

		// @TODO simplify?
		function generate(msg, type) {
			// @TODO in_array info / warning / error / success
			var notificationData = {"message": msg, "type": type};

			// @TODO only if debug
			$log.info(notificationData);

			_.forEach(subscriptions, function (callback) {
				callback(notificationData);
			});
		}
	};

})();