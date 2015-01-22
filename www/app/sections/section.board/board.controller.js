(function() {
	"use strict";

	angular
		.module("omApp")
		.controller("BoardController", BoardController)
		.constant("magicForBoard", {
			pageTitle: "Board",
			pageTransparentNav: false,
			gridDefaultRowCount: 3,
			gridDefaultColumnCount: 3,
			gridMaxRows: 6,
			gridMinRows: 2,
			gridMaxColumns: 6,
			gridMinColumns: 2,
			gridStartingPosition: {
				"row": 1,
				"column": 1
			},
			fadeUmiTimeout: 250
		});

	function BoardController($scope, $http, $timeout, $routeParams, notification, magicForBoard) {
		var initId = $routeParams.id;
		var grid = [];

		$scope.$parent.title = magicForBoard.pageTitle;
		$scope.$parent.transparentNav = magicForBoard.pageTransparentNav;

		$scope.rows = sessionStorage.getItem("gridRows") ? _.parseInt(sessionStorage.getItem("gridRows")) : magicForBoard.gridDefaultRowCount;
		$scope.columns = sessionStorage.getItem("gridColumns") ? _.parseInt(sessionStorage.getItem("gridColumns")) : magicForBoard.gridDefaultColumnCount;

		for (var i = 0; i < $scope.rows; i++) {
			var row = [];

			for (var c = 0; c < $scope.columns; c++) {
				row.push(c);
			}
			grid.push(row);
		}

		$scope.grid = grid;

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

				for (var i = 0; i < $scope.columns; i++) {
					row.push(i);
				}

				switch (method) {
					case "add":
						if ($scope.rows > (magicForBoard.gridMaxRows - 1)) {
							return false;
						}

						$scope.rows = $scope.rows + 1;
						$scope.grid.push(row);
						break;
					case "remove":
						if ($scope.rows < (magicForBoard.gridMinRows + 1)) {
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
						if ($scope.columns > (magicForBoard.gridMaxColumns - 1)) {
							return false;
						}

						for (var i = 0; i < $scope.rows; i++) {
							$scope.grid[i].push($scope.columns);
						}
						$scope.columns = $scope.columns + 1;
						break;
					case "remove":
						if ($scope.columns < (magicForBoard.gridMinColumns + 1)) {
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
		 * @param where {object}
		 * @param classes {string | boolean}
		 */
		var getUmi = function(getBy, param, where, classes) {
			var fadeInUmi = function () {
				$scope.fadeInUmi = true;
			};

			var url = (getBy == "uriFriendlyTitle") ? appConfig.apiUrl + param : appConfig.apiUrl + getBy + "/" + param

			$http.get(url).
				success(function (data) {
					if (classes) {
						data.targetClasses = classes;
					}

					$scope.grid[where.row][where.column] = data;
					// TODO this does not work on expanding??
					$timeout(fadeInUmi, magicForBoard.fadeUmiTimeout);
				}).
				error(function (data) {
					// TODO this needs to be properly documented
					notification.generate("There was an error loading requested contribution.", "error", data);
				});
		};

		getUmi("uriFriendlyTitle", initId, magicForBoard.gridStartingPosition, false);

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

			var targetPosition = {
				"row": targetPosition[0],
				"column": targetPosition[1]
			};

			getUmi("id", newUmiID, targetPosition, targetClasses.join(" "));
		};
	}

})();