app.controller("GlobalController", function ($scope, $location, $window) {

	// This is a test function that will run on page load.
	console.log("OpenMaths is now running");

	$scope.$watch(function () {
		return $location.path();
	}, returnPath);

	function returnPath() {
		var splitUrl = $location.url().split("/");
		$scope.path = splitUrl[1] == "" ? "board" : splitUrl[1];

		$window.ga("send", "pageview", {page: $location.path()});
	}

	$scope.themeClass = "light";
	$scope.setTheme = function(theme) {
		$scope.themeClass = theme;
	};

	$scope.umiFontClass = "umi-font-modern";
	$scope.setUmiFont = function(font) {
		$scope.umiFontClass = font;
	};

});

app.controller("BoardController", function ($scope, $rootScope, $http, $timeout) {
	// Abstract this as a config var
	var initDate = new Date("2014-11-22");

	$rootScope.title = "Board";
	$rootScope.navTopTransparentClass = true;
	$scope.navBoard = true;
	$scope.initDate = initDate.getDay() + " " + initDate.getMonth() + " " + initDate.getFullYear();

	$scope.backgroundScroll = function() {
		var termLength = $scope.searchUmiTerm.length;
		var percentage = termLength * 2.5 + "%";

		if (termLength < 40) {
			document.getElementById("board-holder").style.backgroundPositionY = percentage;
		}

		if (termLength > 2) {
			var results = [
				{"title" : "Pythagorean Theorem", "score" : "87%"}
			];

			if (termLength > 3) {
				results.push({"title" : "Euclidian Space", "score" : "73%"});
			} if (termLength > 4) {
				results.push({"title" : "Circle", "score" : "69%"});
			} if (termLength > 5) {
				results.push({"title" : "Fermat's Last Theorem", "score" : "21%"});
			} if (termLength > 6) {
				results.push({"title" : "Arithmetic Progression", "score" : "18%"});
			}

			$scope.searchUmiResults = results;
		}
		else {
			$scope.searchUmiResults = false;
		}
	};

	$http.get("https://api.github.com/orgs/OpenMaths/events?per_page=25").
		success(function (data) {
			$scope.gitHubFeed = data;

			console.log(data);
		}).
		error(function (data) {
			console.log(data);
		});

	$scope.grid = [];

	for (i = 0; i < 3; i++) {
		var row = [];

		row.push(1);
		row.push(2);
		row.push(3);

		$scope.grid.push(row);
	}

	$scope.getUmi = function() {
		$http.get(appConfig.apiUrl + "?umi=" + $scope.searchUmiTerm).
			success(function (data, status) {
				$rootScope.showGrid = true;
				$rootScope.navTopTransparentClass = false;

				$scope.grid[1][1] = data;

				var fadeInUmi = function() {
					$scope.fadeInUmi = true;
				};

				$timeout(fadeInUmi, 250);
			}).
			error(function (data, status) {

				// TODO: change this to a more semantic system of displaying errors
				console.log("No data to display :-(");

				console.log(data + " | " + status);
			});
	};

	$scope.position = function(row, column, direction, newUmiID) {
		var targetClasses = [];

		if (direction == "up") {
			var targetPosition = [row - 1, column];
		} else if (direction == "down") {
			var targetPosition = [row + 1, column];
		} else if (direction == "left") {
			var targetPosition = [row, column - 1];
		} else if (direction == "right") {
			var targetPosition = [row, column + 1];
		}

		if (targetPosition[0] == 0) {
			targetClasses.push("closes-top");
		} else if (targetPosition[0] == 2) {
			targetClasses.push("closes-bottom");
		} else if (targetPosition[1] == 0) {
			targetClasses.push("closes-left");
		} else if (targetPosition[1] == 2) {
			targetClasses.push("closes-right");
		}

		$http.get(appConfig.apiUrl + "?umi=" + newUmiID).
			success(function (data, status) {
				data.closingClasses = targetClasses.join(" ");
				$scope.grid[targetPosition[0]][targetPosition[1]] = data;
			}).
			error(function (data, status) {

				// TODO: change this to a more semantic system of displaying errors
				console.log("No data to display :-(");

				console.log(data + " | " + status);
			});

	};
});

app.controller("ContributeController", function ($scope, $rootScope) {
	$rootScope.title = "Contribute";
	$rootScope.navTopTransparentClass = false;

	$scope.navContribute = true;
});

app.controller("FeaturesController", function ($scope, $rootScope) {
	$rootScope.title = "Features";
	$rootScope.navTopTransparentClass = true;

	$scope.navFeatures = true;
});

app.controller("OoopsController", function ($scope, $rootScope) {
	$rootScope.title = "Ooops";
});

app.controller("SassController", function ($scope, $rootScope, $location) {
	$rootScope.title = "SASS Library";
});