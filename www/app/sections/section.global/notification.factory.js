(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("notification", notificationFactory)
		.constant("magicForNotificationFactory", {
			allowedTypes: ["info", "warning", "error", "success"]
		});

	function notificationFactory($log, magicForNotificationFactory, magic) {
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
				magic.debug ? $log.error("Method " + type + " not allowed.") : "";
				return false;
			}

			var notificationData = {"message": msg, "type": type};

			if (stackTrace) {
				notificationData.trace = stackTrace;
			}

			magic.debug ? $log.info(notificationData) : "";

			_.forEach(subscriptions, function (callback) {
				callback(notificationData);
			});
		}
	};

})();