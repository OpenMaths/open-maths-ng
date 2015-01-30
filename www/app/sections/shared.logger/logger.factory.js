(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("logger", loggerFactory)
		.constant("magicForLoggerFactory", {
			allowedTypes: ["info", "warn", "error", "debug", "log"]
		});

	function loggerFactory($log, magic, magicForLoggerFactory) {
		var factory = {
			log: logEvent
		};

		return factory;

		function logEvent(dataOrMessage, type) {
			if (_.indexOf(magicForLoggerFactory.allowedTypes, type) == -1) {
				$log.debug("$log type " + type + " not allowed");
				return false;
			}

			magic.debug ? $log[type](dataOrMessage) : "";
		}
	}

})();