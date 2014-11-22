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

	$scope.themeClass = "dark";
	$scope.setTheme = function(theme) {
		$scope.themeClass = theme;
	};

	$scope.umiFontClass = "umi-font-modern";
	$scope.setUmiFont = function(font) {
		$scope.umiFontClass = font;
	};

});

app.controller("ContributeController", function ($scope, $rootScope) {
	$rootScope.title = "Contribute";
	$scope.navContribute = true;
});

app.controller("BoardController", function ($scope, $rootScope, $http) {
	$rootScope.title = "Board";
	$scope.navBoard = true;

	$scope.grid = [];

	for (i = 0; i < 3; i++) {
		var row = [];

		row.push(1);
		row.push(2);
		row.push(3);

		$scope.grid.push(row);
	}

	$http.get(appConfig.apiUrl + "?umi=" + 5).
		success(function (data, status, headers, config) {
			$scope.grid[1][1] = data;
		}).
		error(function (data, status, headers, config) {

			// TODO: change this to a more semantic system of displaying errors
			console.log("No data to display :-(");

			console.log(data + " | " + status + " | " + headers + " | " + config);
		});

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
			success(function (data, status, headers, config) {
				data.closingClasses = targetClasses.join(" ");
				$scope.grid[targetPosition[0]][targetPosition[1]] = data;
			}).
			error(function (data, status, headers, config) {

				// TODO: change this to a more semantic system of displaying errors
				alert("No data to display :-(");

				console.log(data + " | " + status + " | " + headers + " | " + config);
			});

	};

});

app.controller("OoopsController", function ($scope, $rootScope) {
	$rootScope.title = "Ooops";
});

app.controller("SassController", function ($scope, $rootScope, $location) {
	$rootScope.title = "SASS Library";
});