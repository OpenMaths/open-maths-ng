var gridDefaultRowCount = 3;
var gridDefaultColumnCount = 3;

var gridMaxRows = 6;
var gridMinRows = 2;
var gridMaxColumns = 6;
var gridMinColumns = 2;

app.controller("BoardController", function ($scope, $http, $timeout, $routeParams) {
	$scope.$parent.title = "Board";
	$scope.$parent.transparentNav = false;

	// TODO abstract to magic numbers
	$scope.rows = sessionStorage.getItem("gridRows") ? parseInt(sessionStorage.getItem("gridRows")) : gridDefaultRowCount;
	$scope.columns = sessionStorage.getItem("gridColumns") ? parseInt(sessionStorage.getItem("gridColumns")) : gridDefaultColumnCount;

	var initId = $routeParams.id;

	$scope.grid = [];

	for (i = 0; i < $scope.rows; i++) {
		var row = [];

		for (c = 0; c < $scope.columns; c++) {
			row.push(c);
		}

		$scope.grid.push(row);
	}

	/**
	 * Manages the grid layout
	 *
	 * @param method {string} add | remove
	 * @param type {string} row | column
	 * @returns {boolean}
	 *
	 * @TODO: abstract max rows and columns into config?
	 */
	$scope.manageGrid = function(method, type) {
		if (type == "row") {
			var row = [];

			for (i = 0; i < $scope.columns; i++) {
				row.push(i);
			}

			switch (method) {
				case "add":
					if ($scope.rows > (gridMaxRows - 1)) {
						return false;
					}

					$scope.rows = $scope.rows + 1;
					$scope.grid.push(row);
					break;
				case "remove":
					if ($scope.rows < (gridMinRows + 1)) {
						return false;
					}

					$scope.rows = $scope.rows - 1;
					$scope.grid.pop();
					break;
			}

			sessionStorage.setItem("gridRows", $scope.rows);
		} else if (type == "column") {
			switch (method) {
				case "add":
					if ($scope.columns > (gridMaxColumns - 1)) {
						return false;
					}

					for (i = 0; i < $scope.rows; i++) {
						$scope.grid[i].push($scope.columns);
					}
					$scope.columns = $scope.columns + 1;
					break;
				case "remove":
					if ($scope.columns < (gridMinColumns + 1)) {
						return false;
					}

					for (i = 0; i < $scope.rows; i++) {
						$scope.grid[i].pop();
					}
					$scope.columns = $scope.columns - 1;
					break;
			}

			sessionStorage.setItem("gridColumns", $scope.columns);
		}
	};

	var getUmi = function(getBy, param, where, classes) {
		var fadeInUmi = function () {
			$scope.fadeInUmi = true;
		};

		var url = (getBy == "uriFriendlyTitle") ? appConfig.apiUrl + "/" + param : appConfig.apiUrl + "/" + getBy + "/" + param

		$http.get(url).
			success(function (data) {
				if (classes) {
					data.targetClasses = classes;
				}

				$scope.grid[where[0]][where[1]] = data;
				$timeout(fadeInUmi, 250);
			}).
			error(function () {
				// TODO this needs to be properly documented
				$scope.$parent.notification = {
					"message": "There was an error loading the requested contribution.",
					"type": "error",
					"act": true
				};
				$timeout(function () {
					$scope.$parent.notification.act = false;
				}, 2500);
			});
	};

	getUmi("uriFriendlyTitle", initId, [1,1]);

	$scope.position = function (row, column, direction, newUmiID) {
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
		} else if (targetPosition[0] == ($scope.rows - 1)) {
			targetClasses.push("closes-bottom");
		} else if (targetPosition[1] == 0) {
			targetClasses.push("closes-left");
		} else if (targetPosition[1] == ($scope.columns - 1)) {
			targetClasses.push("closes-right");
		}

		getUmi("id", newUmiID, [targetPosition[0],targetPosition[1]], targetClasses.join(" "));
	};
});