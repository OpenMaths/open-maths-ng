(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("lStorage", localStorage);

	function localStorage($window) {
		var factory = {
			set: setObject,
			get: getObject,
			remove: removeObject
		};

		return factory;

		function setObject(key, data) {
			$window.localStorage.setItem(key, JSON.stringify(data));
			return true;
		}

		function getObject(key) {
			var data = $window.localStorage.getItem(key);
			return data ? JSON.parse(data) : false;
		}

		function removeObject(key) {
			if (getObject(key)) {
				$window.localStorage.removeItem(key);
				return true;
			}

			return false;
		}
	}

})();