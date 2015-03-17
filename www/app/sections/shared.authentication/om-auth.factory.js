(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("omAuth", omAuth)
		.constant("magicForOmAuth", {
			authRetry: 3
		});

	function omAuth($http, notification, magic, magicForOmAuth) {

		return {
			signIn: signIn,
			signOut: signOut
		};

		function signIn(authResult, token, callback) {
			var googleApiPromise = function () {
				return $http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token.access_token);
			};
			var arftPromise = function (gPlusId) {
				return $http.post(magic.api + "arft", gPlusId);
			};
			var omLoginPromise = function (loginData) {
				return $http.post(magic.api + "login", loginData);
			};

			Rx.Observable.fromPromise(googleApiPromise())
				.map(function (d) {
					var data = d.data;
					data.accessToken = authResult.access_token;
					data.avatarStyle = {"background-image": "url('" + data.picture + "')"};

					return Rx.Observable.fromPromise(arftPromise(data.id))
						.map(function (arftResponse) {
							return {arftResponse: arftResponse.data, data: data};
						});
				})
				.switch()
				.map(function (d) {
					var arft = d.arftResponse,
						data = d.data,
						loginData = {
							arfToken: arft,
							code: authResult.code,
							gmail: data.email,
							gPlusId: data.id
						};

					return Rx.Observable.fromPromise(omLoginPromise(loginData))
						.map(function (loginResult) {
							return {loginResult: loginResult, data: data};
						});
				})
				.switch()
				.retry(magicForOmAuth.authRetry)
				.subscribe(function (d) {
					var login = d.loginResult,
						data = d.data;

					// @TODO this is a VERY hacky solution (is it though?). Do it properly when on internet and can properly test.
					// Also, there should be some unit tests in place
					login.status == 200 ? callback(data) : notification.generate("There was an error signing you in to our application server.", "error", login);
				}, function (errorData) {
					notification.generate("There was an error signing you in to our application server.", "error", errorData);
				});
		}

		function signOut(signOutData, callback) {
			var signOutPromise = function () {
				return $http.post(magic.api + "logout", signOutData)
			};

			// @TODO should this even be done using a callback???? Reconsider..
			// Maybe it could return the observable itself and then controller would subscribe
			Rx.Observable.fromPromise(signOutPromise())
				.subscribe(function () {
					callback();
				}, function (errorData) {
					notification.generate("There was an error signing you out of our application server.", "error", errorData);
				});
		}

	}

})();