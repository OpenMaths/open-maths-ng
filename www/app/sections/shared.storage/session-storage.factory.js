(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("sStorage", sessionStorage);

	function sessionStorage($window) {
		var factory = {
			set: setObject,
			get: getObject,
			remove: removeObject
		};

		return factory;

		function setObject(key, data) {
			$window.sessionStorage.setItem(key, JSON.stringify(data));
			return true;
		}

		function getObject(key) {
			var data = $window.sessionStorage.getItem(key);
			return data ? JSON.parse(data) : false;
		}

		function removeObject(key) {
			if (getObject(key)) {
				$window.sessionStorage.removeItem(key);
				return true;
			}

			return false;
		}
	}

})();