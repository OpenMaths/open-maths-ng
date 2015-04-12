(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("omApi", omApi);

	function omApi($http, notification, logger, magic) {

		return {
			response: response,
			post: post,
			get: get,
			put: put
		};

		function get(url) {
			return $http.get(magic.api + url);
		}

		function post(url, data) {
			return $http.get(magic.api + url, data);
		}

		function put(url, data) {
			return $http.get(magic.api + url, data);
		}

		function response(d) {
			var response = {
				headers: d.config.headers,
				method: d.config.method,
				url: d.config.url,
				status: d.status,
				// OpenMaths-specific
				rType: _.first(_.keys(d.data)),
				rData: _.first(_.values(d.data))
			};

			if (response.rType !== "success") {
				notification.generate("There was an error with our API.", "error", response);
			}

			logger.log(response, "info");
			return response;
		}

	}

})();