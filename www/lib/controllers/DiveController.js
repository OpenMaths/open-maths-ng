app.controller("DiveController", function ($scope, $rootScope, $http, $location) {
	$rootScope.title = "Dive Into";
	$rootScope.navTopTransparentClass = true;

	// Lo-dash test
	var ids = ["1", "2", "3", "4"];

	var idsInt = _.map(ids, function (val) {
		return _.parseInt(val);
	});

	console.log(idsInt);
	// Lo-dash test

	//if (sessionStorage.getItem("umiLastSearchTitle")) {
	//	var umiLastSearchTitle = sessionStorage.getItem("umiLastSearchTitle");
	//	$scope.searchUmiTerm = umiLastSearchTitle;
	//
	//	if (sessionStorage.getItem("umiLastSearchResults")) {
	//		var umiLastSearchResults = sessionStorage.getItem("umiLastSearchResults");
	//		$scope.searchUmiResults = JSON.parse(umiLastSearchResults);
	//	}
	//}

	// Percentage is merely fictional now
	$scope.searchUmiKeyDown = function () {
		var termLength = $scope.searchUmiTerm.length;
		var percentage = termLength * 2.5 + "%";

		if (termLength < 40) {
			document.getElementById("masthead").style.backgroundPositionY = percentage;
		}

		if (termLength > 0) {
			$http.get(appConfig.apiUrl + "/search/" + $scope.searchUmiTerm).
				success(function (data) {
					// Temp implementation of search results metric
					var scoreMetric = 100 / (data.length + 1);
					var scoreMultiplier = 1;

					for (i = data.length; --i >= 0;) {
						var scoreValue = Math.floor(scoreMetric * scoreMultiplier) + "%";
						data[i].score = scoreValue;
						scoreMultiplier = scoreMultiplier + 1;
					}

					$scope.searchUmiResults = {
						"currentSelection": 0,
						"data": data
					};

					console.log($scope.searchUmiResults);
				}).
				error(function (data, status) {
					alert("No data to display :-(");
					console.log(data + " | " + status);
				});
		}
		else {
			$scope.searchUmiResults = false;
		}
	};

	$scope.getUmi = function (uri) {
		if (!uri) {
			if (!$scope.searchUmiResults) {
				return false;
			}
		}

		sessionStorage.setItem("umiLastSearchTitle", $scope.searchUmiTerm);
		sessionStorage.setItem("umiLastSearchResults", JSON.stringify($scope.searchUmiResults));

		$location.path("/board/" + uri);
	};
});