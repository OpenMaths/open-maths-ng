(function() {
	"use strict";

	angular
		.module("omApp")
		.factory("notification", notification);

	function notification($timeout, $log) {
		// @TODO make global / config?
		console.log('oh');


		var subscriptions = [];

		return {
			subscribe: subscribe,
			generate: generate
		};

		function subscribe(callback){
			subscriptions.push(callback);
		}

		function generate (msg, type, scope, apply) {
			var notificationData = { "message": msg, "type": type };

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

			_.forEach(subscriptions, function(callback){
				callback(notificationData);
			});

			//if (apply) {
			//	scope.$apply(function() { scope.notification = notificationData; });
			//} else {
			//	scope.notification = notificationData;
			//}

			// @TODO clear timeout
			//$timeout(function() {
			//	scope.notification.act = false;
			//}, notificationDisappearTimeout);
		}
	};

})();