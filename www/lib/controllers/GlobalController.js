app.controller("GlobalController", function ($scope, $location, $window, $http, $timeout) {

	/**
	 * Test function that will run on page load.
	 */
	console.log("OpenMaths is now running");

	/**
	 * Returns current path
	 *
	 * @TODO abstract welcome page name into config var.
	 */
	function returnPath() {
		var splitUrl = $location.url().split("/");
		$scope.path = splitUrl[1] == "" ? "dive" : splitUrl[1];

		// @TODO: check if this works properly
		$window.ga("send", "pageview", {page: $location.path()});
	};

	/**
	 * Watches changes in URL, returns current path
	 */
	$scope.$watch(function () {
		return $location.path();
	}, returnPath);

	/**
	 * Sets custom theme
	 *
	 * @param theme {string}
	 * @TODO abstract default theme into config var.
	 */
	$scope.setTheme = function (theme) {
		$scope.themeClass = theme;
		localStorage.setItem("themeClass", theme);
	};
	$scope.themeClass = localStorage.getItem("themeClass") ? localStorage.getItem("themeClass") : "light";

	/**
	 * Sets custom font
	 *
	 * @param font {string}
	 * @TODO abstract default font into config var.
	 */
	$scope.setUmiFont = function (font) {
		$scope.umiFontClass = font;
		localStorage.setItem("umiFontClass", font);
	};
	$scope.umiFontClass = localStorage.getItem("umiFontClass") ? localStorage.getItem("umiFontClass") : "umi-font-modern";

	/**
	 * Assign omUser data if authenticated
	 */
	if (sessionStorage.getItem("omUser")) {
		var omUserString = sessionStorage.getItem("omUser");
		$scope.omUser = JSON.parse(omUserString);
	}

	/**
	 * Google Sign In functionality
	 *
	 * @returns {boolean}
	 *
	 * @TODO: Abstract notificaton functionality as a factory / service
	 */
	$scope.googleSignIn = function () {
		if ($scope.omUser) {
			return false;
		}

		gapi.auth.signIn({
			"callback": function (authResult) {
				if (authResult["status"]["signed_in"]) {
					var token = gapi.auth.getToken();

					console.log(authResult);

					$http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token.access_token).
						success(function (data) {
							$scope.omUser = data;
							sessionStorage.setItem("omUser", JSON.stringify(data));

							$scope.notification = {
								"message": "You are now signed in as " + data.email + ".",
								"type": "success",
								"act": true
							};
							$timeout(function () {
								$scope.notification.act = false;
							}, 2500);

							// TEMP testing merely
							var testData = {
								"token": authResult["access_token"],
								"clientId": data["id"]
							};

							$scope.http("POST", "auth", JSON.stringify(testData), function(result){
								alert(result);
							}, false, {"Content-type" : "application/json;charset=UTF-8"});
							// TEMP testing merely

						}).error(function (data, status) {
							$scope.notification = {
								"message": "There was an error during the sign in process.",
								"type": "error",
								"act": true
							};
							$timeout(function () {
								$scope.notification.act = false;
							}, 2500);
						});
				} else {
					$scope.notification = {
						"message": "There was an error (" + authResult["error"] + ") during the sign in process.",
						"type": "error",
						"act": true
					};
					$timeout(function () {
						$scope.notification.act = false;
					}, 2500);
				}
			}
		});
	};

	/**
	 * Google Sign Out functionality
	 *
	 * @TODO: Abstract notificaton functionality as a factory / service
	 */
	$scope.googleSignOut = function () {
		gapi.auth.signOut();

		$scope.omUser = false;
		sessionStorage.removeItem("omUser");

		$scope.notification = {
			"message": "You have been successfully signed out.",
			"type": "info",
			"act": true
		};
		$timeout(function () {
			$scope.notification.act = false;
		}, 2500);
	};

	/**
	 * Makes URL inaccessible if a user is not authenticated
	 *
	 * @param url {string}
	 * @param message {string}
	 * @param type {string} info | warning | error | success
	 * @returns {boolean}
	 *
	 * @TODO: Abstract notificaton functionality as a factory / service
	 */
	$scope.accessUrlUser = function (url, message, type) {
		if (!$scope.omUser) {

			$scope.notification = {"message": message, "type": type, "act": true};
			$timeout(function () {
				$scope.notification.act = false;
			}, 2500);

			return false;
		}
		else {
			$location.url("/" + url);
		}
	};

	// Should this be concealed / definition approached differently?
	$scope.http = function (method, uri, data, success, error, headers) {
		var http = new XMLHttpRequest();

		var url = appConfig.apiUrl + "/" + uri;

		// allowed methods checked against config??
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
						$scope.$apply(function () {
							$scope.notification = {
								"message": "There was an error with our application server while dealing with your request.",
								"type": "error",
								"act": true
							};
							$timeout(function () {
								$scope.notification.act = false;
							}, 2500);
						});
					}
				}
			}
		};

		http.send(data);
	};

});