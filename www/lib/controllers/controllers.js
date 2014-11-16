app.controller("GlobalController", function ($scope, $location, $window) {

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

		$window.ga("send", "pageview", {page: $location.path()});
	}

});

app.controller("HomeController", function ($scope, $rootScope, $http) {
	$rootScope.title = "Home";

	$scope.requestUmi = function () {

		$http.get(appConfig.apiUrl + "/umi/" + $scope.requestId).
			success(function (data, status, headers, config) {
				$scope.data = data;
			}).
			error(function (data, status, headers, config) {
				$scope.data = "No data to display :-(";
			});

	};
});

app.controller("EditorController", function ($scope, $rootScope) {
	$rootScope.title = "Editor";
});

app.controller("BoardController", function ($scope, $rootScope) {
	$rootScope.title = "Board";

	$scope.data = ''; // This will be the json to populate certain umi
});

app.controller("OoopsController", function ($scope, $rootScope) {
	$rootScope.title = "Ooops";
});

app.controller("SassController", function ($scope, $rootScope, $location) {
	$rootScope.title = "SASS Library";
});
