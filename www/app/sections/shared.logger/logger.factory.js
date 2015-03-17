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
			if (!_.contains(magicForLoggerFactory.allowedTypes, type)) {
				$log.debug("$log type " + type + " not allowed");
				return false;
			}

			// @TODO temporarily removed to enable logging in production in Alpha
			$log[type](dataOrMessage);
			//magic.debug ? $log[type](dataOrMessage) : "";
		}
	}

})();