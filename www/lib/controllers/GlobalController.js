app.controller("GlobalController", function ($scope, $location, $window, $http) {

	// This is a test function that will run on page load.
	console.log("OpenMaths is now running");

	$scope.$watch(function () {
		return $location.path();
	}, returnPath);

	function returnPath() {
		var splitUrl = $location.url().split("/");
		$scope.path = splitUrl[1] == "" ? "dive-into" : splitUrl[1];

		$window.ga("send", "pageview", {page: $location.path()});
	}

	$scope.themeClass = localStorage.getItem("themeClass") ? localStorage.getItem("themeClass") : "light";
	$scope.setTheme = function (theme) {
		$scope.themeClass = theme;
		localStorage.setItem("themeClass", theme);
	};

	$scope.umiFontClass = localStorage.getItem("umiFontClass") ? localStorage.getItem("umiFontClass") : "umi-font-modern";
	$scope.setUmiFont = function (font) {
		$scope.umiFontClass = font;
		localStorage.setItem("umiFontClass", font);
	};

	if (sessionStorage.getItem("omUser")) {
		var omUserString = sessionStorage.getItem("omUser");
		$scope.omUser = JSON.parse(omUserString);
	}

	$scope.googleSignOut = function () {
		gapi.auth.signOut();

		$scope.omUser = false;
		sessionStorage.removeItem("omUser");

		$location.path("/");
	};

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
							$scope.omUser = data;
							sessionStorage.setItem("omUser", JSON.stringify(data));
						}).error(function (data, status) {
							alert("No data to display :-(");
							console.log(data + " | " + status);
						});
				} else {
					alert(authResult["error"]);
					console.log("Sign-in state: " + authResult["error"]);
				}
			}
		});
	};

	$scope.accessUrlUser = function(url) {
		if (!$scope.omUser) {
			alert("You must be logged in to Contribute to OpenMaths!");
			return false;
		}
		else {
			$location.url("/" + url);
		}
	};

});