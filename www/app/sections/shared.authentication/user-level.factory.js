(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("userLevel", userLevelFactory);

	function userLevelFactory($location, sStorage, notification) {

		return {
			access: access,
			check: check
		};

		function access(url) {
			var omUser = sStorage.get("omUser");

			if (!omUser) {
				notification.generate("You need to be signed in to access this section.", "info");

				return false;
			} else {
				$location.url("/" + url);
			}
		}

		function check() {
			var omUser = sStorage.get("omUser");

			if (!omUser) {
				notification.generate("You need to be signed in to access this section.", "info");
				$location.url("/");

				return false;
			}
		}

	}

})();