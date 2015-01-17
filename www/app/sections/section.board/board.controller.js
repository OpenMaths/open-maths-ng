(function() {
	"use strict";

	angular
		.module("omApp")
		.controller("BoardController", BoardController);

	function BoardController($scope, $http, $timeout, $routeParams) {
		// @TODO move to default config?
		var gridDefaultRowCount = 3;
		var gridDefaultColumnCount = 3;

		var gridMaxRows = 6;
		var gridMinRows = 2;
		var gridMaxColumns = 6;
		var gridMinColumns = 2;

		var fadeUmiTimeout = 250;

		var initId = $routeParams.id;

		$scope.$parent.title = "Board";
		$scope.$parent.transparentNav = false;

		$scope.rows = sessionStorage.getItem("gridRows") ? _.parseInt(sessionStorage.getItem("gridRows")) : gridDefaultRowCount;
		$scope.columns = sessionStorage.getItem("gridColumns") ? _.parseInt(sessionStorage.getItem("gridColumns")) : gridDefaultColumnCount;

		$scope.grid = [];

		for (var i = 0; i < $scope.rows; i++) {
			var row = [];

			for (var c = 0; c < $scope.columns; c++) {
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

		/**
		 * Gets umi, either from URL or as a new expansion
		 *
		 * @param getBy {string}
		 * @param param {string}
		 * @param where {array}
		 * @param classes {string}
		 */
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
					// TODO this does not work on expanding??
					$timeout(fadeInUmi, fadeUmiTimeout);
				}).
				error(function () {
					// TODO this needs to be properly documented
					$scope.notify(
						"There was an error loading requested contribution.",
						"error", $scope.$parent
					);
				});
		};

		getUmi("uriFriendlyTitle", initId, [1,1]);

		/**
		 * Position elements correctly within a grid
		 *
		 * @param row {int}
		 * @param column {int}
		 * @param direction {string}
		 * @param newUmiID {string}
		 */
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
	}

})();