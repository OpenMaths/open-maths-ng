(function() {
	"use strict";

	angular
		.module("omApp")
		.factory("sStorage", sessionStorage);

	function sessionStorage($window) {
		var factory = {
			set: setObject,
			get: getObject
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
	}

})();