(function() {
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

		function subscribe(callback){
			subscriptions.push(callback);
		}

		// @TODO simplify?
		function generate (msg, type) {
			switch(type) {
				case "info":
					$log.info(msg);
					break;
				case "warning":
					$log.warn(msg);
					break;
				case "error":
					$log.error(msg);
					break;
				case "success":
					$log.success(msg);
					break;
				default:
					type = "info";
					$log.info(msg);
					break;
			}

			var notificationData = { "message": msg, "type": type };

			_.forEach(subscriptions, function(callback){
				callback(notificationData);
			});
		}
	};

})();