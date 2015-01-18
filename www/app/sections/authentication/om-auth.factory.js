(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("omAuth", omAuth);

	function omAuth($http, CORS, notification) {

		return {
			signIn: signIn,
			signOut: signOut
		};

		function signIn(authResult, token, callback) {
			$http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token.access_token).
				success(function (data) {
					data.accessToken = authResult["access_token"];
					data.avatarStyle = {"background-image": "url('" + data["picture"] + "')"};

					// Retrieve anti request forgery token first
					CORS.request("POST", "arft", data.id, function (token) {
						var loginData = {
							"code": authResult.code,
							"gPlusId": data.id,
							"arfToken": token
						};

						CORS.request("POST", "login", JSON.stringify(loginData), function (result) {
							var res = JSON.parse(result);

							if (_.first(_.keys(res)) == "successMsg") {
								callback(data);
							} else {
								notification.generate("There was an error signing you in to our application server.", "error");
							}
						}, false, {"Content-type": "application/json;charset=UTF-8"});
					}, false, {"Content-type": "application/json;charset=UTF-8"});
				}).error(function () {
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
			CORS.request("POST", "logout", JSON.stringify(signOutData), function () {
				callback(true);
			}, false, {"Content-type": "application/json;charset=UTF-8"});
		}

	}

})();