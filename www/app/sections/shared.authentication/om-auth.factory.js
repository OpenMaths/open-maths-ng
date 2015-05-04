(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("omAuth", omAuth)
		.constant("magicForOmAuth", {
			authRetry: 3
		});

	function omAuth($http, omApi, notification, magicForOmAuth) {

		return {
			signIn: signIn,
			signOut: signOut
		};

		function signIn(authResult, token, callback) {
			var googleApiPromise = function () {
				return $http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token.access_token);
			};
			var arftPromise = function (gPlusId) {
				return omApi.post("arft", gPlusId);
			};
			var omLoginPromise = function (loginData) {
				return omApi.post("login", loginData);
			};

			Rx.Observable.fromPromise(googleApiPromise())
				.map(function (d) {
					var userData = d.data;
					userData.accessToken = authResult.access_token;
					userData.avatarStyle = {"background-image": "url('" + userData.picture + "')"};

					return Rx.Observable.fromPromise(arftPromise(userData.id))
						.map(function (arftResponse) {
							var response = omApi.response(arftResponse);
							return response ? response.data : false;
						})
						.where(function (arftResponse) {
							return arftResponse;
						})
						.map(function (arftResponse) {
							return {arftResponse: arftResponse, userData: userData};
						});
				})
				.switch()
				.map(function (d) {
					var arft = d.arftResponse,
						userData = d.userData,
						loginData = {
							arfToken: arft,
							code: authResult.code,
							gmail: userData.email,
							gPlusId: userData.id
						};

					return Rx.Observable.fromPromise(omLoginPromise(loginData))
						.map(function (loginResponse) {
							var response = omApi.response(loginResponse);
							return response ? response.data : false;
						})
						.where(function(loginResponse) {
							return loginResponse;
						})
						.map(function (loginResponse) {
							return {loginResult: loginResponse, userData: userData};
						});
				})
				.switch()
				.retry(magicForOmAuth.authRetry)
				.subscribe(function (d) {
					var userData = d.userData;

					// @TODO this is a VERY hacky solution (is it though?). Do it properly when on internet and can properly test.
					// Also, there should be some unit tests in place
					//login.status == 200 ? callback(data) : notification.generate("There was an error signing you in to our application server.", "error", login);
					callback(userData);
				}, function (errorData) {
					notification.generate("There was an error signing you in to our application server.", "error", errorData);
				});
		}

		function signOut(signOutData, callback) {
			var signOutPromise = function () {
				return omApi.post("logout", signOutData)
			};

			// @TODO should this even be done using a callback???? Reconsider..
			// Maybe it could return the observable itself and then controller would subscribe
			Rx.Observable.fromPromise(signOutPromise())
				.map(function (signOutResponse) {
					var response = omApi.response(signOutResponse);
					return response ? response.data : false;
				})
				.where(function(signOutResponse) {
					return signOutResponse;
				})
				.subscribe(function () {
					callback();
				}, function (errorData) {
					notification.generate("There was an error signing you out of our application server.", "error", errorData);
				});
		}

	}

})();