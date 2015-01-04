var notificationDisappearTimeout = 2500;

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

					$http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token.access_token).
						success(function (data) {
							data.accessToken = authResult["access_token"];
							data.avatarStyle = {"background-image": "url('" + data["picture"] + "')"};

							// Retrieve anti request forgery token first
							$scope.http("POST", "arft", data.id, function(token){
								var loginData = {
									"code": authResult.code,
									"gPlusId": data.id,
									"arfToken": token
								};

								$scope.http("POST", "login", JSON.stringify(loginData), function(result){
									var res = JSON.parse(result);

									if (_.first(_.keys(res)) == "successMsg") {
										$scope.omUser = data;

										sessionStorage.setItem("omUser", JSON.stringify(data));

										$scope.notify(
											"You are now signed in as " + data.email + ".",
											"success", $scope, true
										);
									} else {
										$scope.notify(
											"There was an error signing you in to our application server.",
											"error", $scope, true
										);
									}
								}, false, {"Content-type" : "application/json;charset=UTF-8"});
							}, false, {"Content-type" : "application/json;charset=UTF-8"});
						}).error(function () {
							$scope.notify(
								"There was an error retrieving user data from Google.",
								"error", $scope, true
							);
						});
				} else {
					if (authResult["error"] !== "immediate_failed") {
						$scope.notify(
							"There was an error (" + authResult["error"] + ") during the sign in process.",
							"error", $scope, true
						);
					}
				}
			}
		});
	};

	/**
	 * Google Sign Out functionality
	 */
	$scope.googleSignOut = function () {
		gapi.auth.signOut();

		var signOutData = {
			accessToken: $scope.omUser.accessToken,
			gPlusId: $scope.omUser.id
		};

		$scope.http("POST", "logout", JSON.stringify(signOutData), function() {
			$scope.omUser = false;
			sessionStorage.removeItem("omUser");

			$scope.notify(
				"You have been successfully signed out.",
				"info", $scope, true
			);
		}, false, {"Content-type" : "application/json;charset=UTF-8"});
	};

	/**
	 * Makes URL inaccessible if a user is not authenticated
	 *
	 * @param url {string}
	 * @param message {string}
	 * @param type {string} info | warning | error | success
	 * @returns {boolean}
	 *
	 */
	$scope.accessUrlUser = function (url, message, type) {
		if (!$scope.omUser) {
			$scope.notify(message, type, $scope);
			return false;
		}
		else {
			$location.url("/" + url);
		}
	};

	/**
	 * Makes CORS possible (Always sends JSON)
	 *
	 * @param method {string} POST | PUT
	 * @param uri {string}
	 * @param data {mixed}
	 * @param success {function}
	 * @param error {function}
	 * @param headers {object}
	 * @returns {boolean}
	 *
	 * @TODO Should this be concealed / definition approached differently?
	 */
	$scope.http = function (method, uri, data, success, error, headers) {
		var http = new XMLHttpRequest();

		var url = appConfig.apiUrl + "/" + uri;

		if (_.indexOf(appConfig.apiCORSMethods, method) == -1) {
			// TODO add proper debugging
			console.log("Method " + method + " not allowed.");
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
						$scope.notify(
							"There was an error with our application server while dealing with your request.",
							"error", $scope, true
						);
					}
				}
			}
		};

		http.send(data);
	};

	/**
	 * Renders notifications
	 *
	 * @param msg {string}
	 * @param type {string} info | warning | error | success
	 * @param scope {object}
	 * @param apply {boolean}
	 *
	 * @TODO look into clearing the timeout
	 */
	$scope.notify = function(msg, type, scope, apply) {
		var notificationData = { "message": msg, "type": type, "act": true };

		if (apply) {
			scope.$apply(function() { scope.notification = notificationData; });
		} else {
			scope.notification = notificationData;
		}

		$timeout(function() {
			scope.notification.act = false;
		}, notificationDisappearTimeout);
	};

});