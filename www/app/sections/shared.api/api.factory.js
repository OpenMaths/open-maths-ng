(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("omApi", omApi);

	function omApi($http, logger, magic) {

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
			return $http.post(magic.api + url, data);
		}

		function put(url, data) {
			return $http.put(magic.api + url, data);
		}

		function response(d) {
			var response = {
				headers: d.config.headers,
				method: d.config.method,
				url: d.config.url,
				statusCode: d.status,
				status: _.first(_.keys(d.data)),
				data: _.first(_.values(d.data))
			};

			logger.log(response, "info");

			return response;
		}

	}

})();