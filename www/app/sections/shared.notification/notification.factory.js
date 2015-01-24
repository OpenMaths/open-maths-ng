(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("notification", notificationFactory)
		.constant("magicForNotificationFactory", {
			allowedTypes: ["info", "warning", "error", "success"]
		});

	function notificationFactory(logger, magicForNotificationFactory) {
		var subscriptions = [];

		return {
			subscribe: subscribe,
			generate: generate
		};

		function subscribe(callback) {
			subscriptions.push(callback);
		}

		function generate(msg, type, stackTrace) {
			if (_.indexOf(magicForNotificationFactory.allowedTypes, type) == -1) {
				logger.log("Method " + type + " not allowed.", "debug");
				return false;
			}

			var notificationData = {"message": msg, "type": type};

			if (stackTrace) {
				notificationData.trace = stackTrace;
			}

			logger.log(notificationData, "info");

			_.forEach(subscriptions, function (callback) {
				callback(notificationData);
			});
		}
	};

})();