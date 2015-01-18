(function() {
	"use strict";

	angular
		.module("omApp")
		.factory("CORS", corsFactory);

	function corsFactory(notification) {

		return {
			request: make
		};

		function make(method, uri, data, success, error, headers) {
			var http = new XMLHttpRequest();

			var url = appConfig.apiUrl + "/" + uri;

			if (_.indexOf(appConfig.apiCORSMethods, method) == -1) {
				notification.generate("Method " + method + " not allowed.", "error");
				return false;
			}

			http.open(method, url, true);

			_.forEach(_.keys(headers), function (key) {
				http.setRequestHeader(key, headers[key]);
			});

			http.onreadystatechange = function () {
				var response = http.responseText;

				if (http.readyState == 4) {
					if (http.status == 200) {
						success(response);
					} else {
						if (error) {
							error(response);
						} else {
							notification.generate("There was an error with our application server while dealing with your request.", "error");
						}
					}
				}
			};

			http.send(data);
		}

	}

})();