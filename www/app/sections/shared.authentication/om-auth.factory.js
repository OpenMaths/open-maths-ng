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

			var arftObservable = googleApiObservable.subscribe(function (d) {
				var data = d.data;
				data.accessToken = authResult.access_token;
				data.avatarStyle = {"background-image": "url('" + data.picture + "')"};

				return {
					observable: Rx.Observable.fromPromise(arftPromise(data.id)),
					data: data
				};
			}, function (errorData) {
				notification.generate("There was an error retrieving user data from Google.", "error", errorData);
			});

			var omLoginObservable = arftObservable.observable.subscribe(function(data) {
				var loginData = {
					arfToken: token,
					code: authResult.code,
					gmail: arftObservable.data.email,
					gPlusId: arftObservable.data.id
				};

				return Rx.Observable.fromPromise(omLoginPromise(loginData));
			}, function(errorData) {
				notification.generate("There was an error getting the anti request forgery token from our application server.", "error", errorData);
			});

			omLoginObservable.subscribe(function(data) {
				var msg = _.first(_.keys(data));
				// @TODO this is a VERY hacky solution. Do it properly when on internet and can properly test.
				// Also, there should be some unit tests in place
				msg == "successMsg" ? callback(data) : notification.generate("There was an error signing you in to our application server.", "error", data);
			}, function(errorData) {
				notification.generate("There was an error signing you in to our application server.", "error", errorData);
			});

			// @TODO test and delete ugly code

			return false;
			$http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token.access_token).
				success(function (data) {
					data.accessToken = authResult.access_token;
					data.avatarStyle = {"background-image": "url('" + data.picture + "')"};

					// Retrieve anti request forgery token first
					$http.post(magic.api + "arft", data.id).
						success(function (token) {
							var loginData = {
								code: authResult.code,
								gPlusId: data.id,
								arfToken: token,
								gmail: data.email
							};

							$http.post(magic.api + "login", loginData).
								success(function (result) {
									if (_.first(_.keys(result)) == "successMsg") {
										callback(data);
									} else {
										notification.generate("There was an error signing you in to our application server.", "error", result);
									}
								}).
								error(function (errorData) {
									notification.generate("There was an error signing you in to our application server.", "error", errorData);
								});
						}).
						error(function (errorData) {
							notification.generate("There was an error getting the anti request forgery token from our application server.", "error", errorData);
						});
				}).error(function (errorData) {
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
			var signOutPromise = function() {
				return $http.post(magic.api + "logout", signOutData)
			};

			var signOutObservable = Rx.Observable.fromPromise(signOutPromise());

			signOutObservable.subscribe(function(data) {
				console.log(data);
				// @TODO should this even be done using a callback???? Reconsider..
				callback();
			}, function(errorData) {
				// @TODO finish this and test what output it spits out. Unit tests needed
			});

			// @TODO get rid of unused ugly code below

			//$http.post(magic.api + "logout", signOutData).
			//	success(function () {
			//
			//	}).
			//	error(function (data, status) {
			//		notification.generate("There was an error signing you out of our application server.", "error", [data, status]);
			//	});
		}

	}

})();