app.controller("DiveController", function ($scope, $rootScope, $http, $location) {
	$rootScope.title = "Dive Into";
	$rootScope.navTopTransparentClass = true;
	$scope.navDive = true;
	$scope.searchUmiResultsCurrentSelection = 0;

	//BEGIN SEARCH
	$scope.searchResults1 = {
		currentSelection: 0,
		data: [
			{title: "Title1"},
			{title: "Title2"}
		]
	};
	$scope.searchResults2 = {
		currentSelection: 0,
		data: [
			{title: "Title3"},
			{title: "Title4"},
			{title: "Title5"}
		]
	};

	$scope.searchResultsNavigate = function (res, e) {
		if (!res) {
			return false;
		}

		console.log(res);

		var searchResultsCount = Object.keys(res.data).length;
		var searchResultsCurrentSelection = res.currentSelection;

		//if (e.keyCode == 13) {
		//	// Dispatch event
		//	alert(res[$scope.searchResultsCurrentSelection]);
		//}

		if (e.keyCode == 38 && searchResultsCurrentSelection > 0) {
			res.currentSelection = searchResultsCurrentSelection - 1;
		} else if (e.keyCode == 40 && searchResultsCurrentSelection < (searchResultsCount - 1)) {
			res.currentSelection = searchResultsCurrentSelection + 1;
		}
	};
	//END SEARCH

	if (sessionStorage.getItem("umiLastSearchTitle")) {
		var umiLastSearchTitle = sessionStorage.getItem("umiLastSearchTitle");
		$scope.searchUmiTerm = umiLastSearchTitle;

		if (sessionStorage.getItem("umiLastSearchResults")) {
			var umiLastSearchResults = sessionStorage.getItem("umiLastSearchResults");
			$scope.searchUmiResults = JSON.parse(umiLastSearchResults);
		}
	}

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
					var scoreMetric = 100 / (data.length + 1);
					var scoreMultiplier = 1;

					for (i = data.length; --i >= 0;) {
						var scoreValue = Math.floor(scoreMetric * scoreMultiplier) + "%";
						data[i].score = scoreValue;
						scoreMultiplier = scoreMultiplier + 1;
					}

					$scope.searchUmiResults = data;
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

	$scope.getUmi = function (id) {
		if (!id) {
			if (!$scope.searchUmiResults) {
				return false;
			}

			id = $scope.searchUmiResults[$scope.searchUmiResultsCurrentSelection]["id"];
		}

		sessionStorage.setItem("umiLastSearchTitle", $scope.searchUmiTerm);
		sessionStorage.setItem("umiLastSearchResults", JSON.stringify($scope.searchUmiResults));

		$location.path("/board/" + id);
	};

	$scope.searchUmiResultsNavigate = function (e) {
		if (!$scope.searchUmiResults) {
			return false;
		}

		var resultsCount = Object.keys($scope.searchUmiResults).length;

		if (e.keyCode == 38 && $scope.searchUmiResultsCurrentSelection > 0) {
			$scope.searchUmiResultsCurrentSelection = $scope.searchUmiResultsCurrentSelection - 1;
		} else if (e.keyCode == 40 && $scope.searchUmiResultsCurrentSelection < (resultsCount - 1)) {
			$scope.searchUmiResultsCurrentSelection = $scope.searchUmiResultsCurrentSelection + 1;
		}
	};
});