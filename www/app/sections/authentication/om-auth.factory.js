(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("omAuth", omAuth);

	function omAuth($http, $log, notification) {

		return {
			signIn: signIn,
			signOut: signOut
		};

		function signIn(authResult, token, callback) {
			$http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token.access_token).
				success(function (data) {
					data.accessToken = authResult.access_token;
					data.avatarStyle = {"background-image": "url('" + data.picture + "')"};

					// Retrieve anti request forgery token first
					$http.post(appConfig.apiUrl + "arft", data.id).
						success(function(token) {
							var loginData = {
								"code": authResult.code,
								"gPlusId": data.id,
								"arfToken": token
							};

							$http.post(appConfig.apiUrl + "login", loginData).
								success(function(result) {
									if (_.first(_.keys(result)) == "successMsg") {
										callback(data);
									} else {
										$log.error(result);
										notification.generate("There was an error signing you in to our application server.", "error");
									}
								}).
								error(function(errorData) {
									$log.error(errorData);
									notification.generate("There was an error signing you in to our application server.", "error");
								});
						}).
						error(function(errorData) {
							$log.error(errorData);
							notification.generate("There was an error getting the anti request forgery token from our application server.", "error");
						});
				}).error(function (errorData) {
					$log.error(errorData);
					notification.generate("There was an error retrieving user data from Google.", "error");
				});
		}

		/**
		 * Google user sign out
		 *
		 * @param signOutData {object}
		 * @returns {promise}
		 */
		function signOut(signOutData, callback) {
			$http.post(appConfig.apiUrl + "logout", signOutData).
				success(function() {
					callback();
				}).
				error(function(status) {
					$log.error(status);
					notification.generate("There was an error signing you out of our application server.", "error");
				});
		}

	}

})();