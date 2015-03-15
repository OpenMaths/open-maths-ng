(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("omAuth", omAuth);

	function omAuth($http, notification, magic) {

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

			var googleApiObservable = Rx.Observable.fromPromise(googleApiPromise());

			googleApiObservable.subscribe(function (d) {
				var data = d.data;
				data.accessToken = authResult.access_token;
				data.avatarStyle = {"background-image": "url('" + data.picture + "')"};

				var arftObservable = Rx.Observable.fromPromise(arftPromise(data.id));

				arftObservable.subscribe(function (arft) {
					var loginData = {
						arfToken: arft.data,
						code: authResult.code,
						gmail: data.email,
						gPlusId: data.id
					};

					var omLoginObservable = Rx.Observable.fromPromise(omLoginPromise(loginData));

					omLoginObservable.subscribe(function (login) {
						// @TODO this is a VERY hacky solution (is it though?). Do it properly when on internet and can properly test.
						// Also, there should be some unit tests in place
						login.status == 200 ? callback(data) : notification.generate("There was an error signing you in to our application server.", "error", login);
					}, function (errorData) {
						notification.generate("There was an error signing you in to our application server.", "error", errorData);
					});
				}, function (errorData) {
					notification.generate("There was an error getting the anti request forgery token from our application server.", "error", errorData);
				});
			}, function (errorData) {
				notification.generate("There was an error retrieving user data from Google.", "error", errorData);
			});
		}

		/**
		 * Google user sign out
		 *
		 * @param signOutData {object}
		 * @returns {promise}
		 */
		function signOut(signOutData, callback) {
			var signOutPromise = function () {
				return $http.post(magic.api + "logout", signOutData)
			};

			var signOutObservable = Rx.Observable.fromPromise(signOutPromise());

			signOutObservable.subscribe(function (data) {
				// @TODO should this even be done using a callback???? Reconsider..
				callback();
			}, function (errorData) {
				notification.generate("There was an error signing you out of our application server.", "error", errorData);
			});
		}

	}

})();