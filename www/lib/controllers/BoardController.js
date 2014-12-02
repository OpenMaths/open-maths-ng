app.controller("BoardController", function ($scope, $rootScope, $http, $timeout, $routeParams) {
	$rootScope.title = "Board";
	$rootScope.navTopTransparentClass = false;
	$scope.navBoard = true;
	$scope.grid = [];

	$scope.rows = sessionStorage.getItem("gridRows") ? parseInt(sessionStorage.getItem("gridRows")) : 3;
	$scope.columns = sessionStorage.getItem("gridColumns") ? parseInt(sessionStorage.getItem("gridColumns")) : 3;

	var initId = $routeParams.id;

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
	 */
	$scope.manageGrid = function(method, type) {
		if (type == "row") {
			var row = [];

			for (i = 0; i < $scope.columns; i++) {
				row.push(i);
			}

			switch (method) {
				case "add":
					if ($scope.rows > 5) {
						return false;
					}

					$scope.rows = $scope.rows + 1;
					$scope.grid.push(row);
					break;
				case "remove":
					if ($scope.rows < 3) {
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
					if ($scope.columns > 5) {
						return false;
					}

					for (i = 0; i < $scope.rows; i++) {
						$scope.grid[i].push($scope.columns);
					}
					$scope.columns = $scope.columns + 1;
					break;
				case "remove":
					if ($scope.columns < 3) {
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

	$http.get(appConfig.apiUrl + "/id/" + initId).
		success(function (data, status) {
			$scope.grid[1][1] = data;

			var fadeInUmi = function () {
				$scope.fadeInUmi = true;
			};

			$timeout(fadeInUmi, 250);
		}).
		error(function (data, status) {
			$scope.notification = {
				"message": "There was an error loading the requested contribution.",
				"type": "error",
				"act": true
			};
			$timeout(function () {
				$scope.notification.act = false;
			}, 2500);
		});

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

		// @TODO: replace the boundary number by an extract from user-defined settings
		if (targetPosition[0] == 0) {
			targetClasses.push("closes-top");
		} else if (targetPosition[0] == 2) {
			targetClasses.push("closes-bottom");
		} else if (targetPosition[1] == 0) {
			targetClasses.push("closes-left");
		} else if (targetPosition[1] == 2) {
			targetClasses.push("closes-right");
		}

		$http.get(appConfig.apiUrl + "/id/" + newUmiID).
			success(function (data) {
				data.closingClasses = targetClasses.join(" ");
				$scope.grid[targetPosition[0]][targetPosition[1]] = data;
			}).
			error(function (data, status) {
				$scope.notification = {
					"message": "There was an error loading the requested contribution.",
					"type": "error",
					"act": true
				};
				$timeout(function () {
					$scope.notification.act = false;
				}, 2500);
			});

	};
});