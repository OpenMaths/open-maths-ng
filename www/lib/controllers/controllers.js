app.controller("GlobalController", function ($scope, $location) {

	// This is a test function that will run on page load.
	console.log("OpenMaths is now running");

	// This watches changes in URL and therefore makes it possible to assign
	// classes and all sorts of dependencies dynamically.
	$scope.$watch(function () {
		return $location.path();
	}, returnPath);

	// This returns the current page name. It is basically the value after the
	// forward slash in the URL, and it helps create custom body classes for
	// specific styling.
	function returnPath() {
		var splitUrl = $location.url().split("/");
		$scope.path = splitUrl[1] == "" ? "home" : splitUrl[1];
	}
});

app.controller("HomeController", function ($scope, $rootScope) {
	$rootScope.title = "Home";

	$scope.requestUmi = function () {

		var http = $.get(appConfig.apiUrl + "/umi/" + $scope.requestId, function (data) {
			console.log(data);
		});

		console.log(http);


		//var http = new XMLHttpRequest();
		//var url = appConfig.apiUrl + "/umi/" + $scope.requestId;
		//
		//http.open("POST", url); // add third parameter for authentication / SSL?
		//
		//http.onload = function () {
		//	console.log(http);
		//};
		//
		//http.onerror = function () {
		//	alert("Woops, there was an error making the request.");
		//};
		//
		//http.send();
	};
});

app.controller("OoopsController", function ($scope, $rootScope) {
	$rootScope.title = "Ooops";
});

app.controller("SassController", function ($scope, $rootScope, $location) {
	$rootScope.title = "SASS Library";
});

app.controller("LoginController", function ($scope, $rootScope, $location, $http) {
	$rootScope.title = "Log in";
});
