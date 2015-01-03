app.controller("DiveController", function ($scope, $http, $location) {
	$scope.$parent.title = "Dive Into";
	$scope.$parent.transparentNav = true;

	//if (sessionStorage.getItem("umiLastSearchTitle")) {
	//	var umiLastSearchTitle = sessionStorage.getItem("umiLastSearchTitle");
	//	$scope.searchUmiTerm = umiLastSearchTitle;
	//
	//	if (sessionStorage.getItem("umiLastSearchResults")) {
	//		var umiLastSearchResults = sessionStorage.getItem("umiLastSearchResults");
	//		$scope.searchUmiResults = JSON.parse(umiLastSearchResults);
	//	}
	//}

	$scope.getUmi = function (uri) {
		if (!uri) {
			// TODO investigate why there is no return false after this if() statement
			if (!$scope.searchUmiResults) {
				return false;
			}
		}

		//sessionStorage.setItem("umiLastSearchTitle", $scope.searchUmiTerm);
		//sessionStorage.setItem("umiLastSearchResults", JSON.stringify($scope.searchUmiResults));

		$location.path("/board/" + uri);
	};
});