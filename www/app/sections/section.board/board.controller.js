(function () {
	"use strict";

	angular
		.module("omApp")
		.controller("BoardController", BoardController)
		.constant("magicForBoard", {
			pageTitle: "Board",
			pageTransparentNav: false,
			fadeUmiTimeout: 250,
			gridDefaultRowCount: 3,
			gridDefaultColumnCount: 3,
			gridStartingPosition: {
				"row": 1,
				"column": 1
			}
		});

	function BoardController($scope, $routeParams, omApi, $location, manageGrid, notification, sStorage, logger, magic, magicForBoard) {
		$scope.$parent.title = magicForBoard.pageTitle;
		$scope.$parent.transparentNav = magicForBoard.pageTransparentNav;

		$scope.rows = sStorage.get("gridRows") ? _.parseInt(sStorage.get("gridRows")) : magicForBoard.gridDefaultRowCount;
		$scope.columns = sStorage.get("gridColumns") ? _.parseInt(sStorage.get("gridColumns")) : magicForBoard.gridDefaultColumnCount;

		var initUriFriendlyTitle = $routeParams.uriFriendlyTitle ? $routeParams.uriFriendlyTitle : false;

		// Generate the whole grid layout
		var grid = [];
		for (var i = 0; i < $scope.rows; i++) {
			var row = [];

			for (var c = 0; c < $scope.columns; c++) {
				row.push(c);
			}
			grid.push(row);
		}
		$scope.grid = grid;

		$scope.manageGrid = function (type, method) {
			switch (type) {
				case "row":
					var rowMeta = manageGrid.row(method, $scope.rows, $scope.columns);

					if (!rowMeta) {
						return false;
					}

					rowMeta.newRow ? $scope.grid.push(rowMeta.newRow) : $scope.grid.pop();

					$scope.rows = rowMeta.newRowsNumber;
					$scope.uiSettings.remember.boardLayout ? sStorage.set("gridRows", rowMeta.newRowsNumber) : "";

					return true;
				case "column":
					var columnMeta = manageGrid.column(method, $scope.columns);

					if (!columnMeta) {
						return false;
					}

					for (i = 0; i < $scope.rows; i++) {
						columnMeta.operation == "push" ? $scope.grid[i].push($scope.columns) : $scope.grid[i].pop();
					}

					$scope.columns = columnMeta.newColumnsNumber;
					$scope.uiSettings.remember.boardLayout ? sStorage.set("gridColumns", columnMeta.newColumnsNumber) : "";

					return true;
				default:
					logger.log("Type " + type + " not allowed", "debug");
					return false;
			}
		};

		var getUmiPromise = function (url) {
			return omApi.get(url);
		};

		var getUmi = function (getBy, param, where, classes) {
			if (param === false) {
				notification.generate("A parameter must be present to access this section. Try navigating through search.", "info");
				$location.url("/");

				return false;
			}

			var url = (getBy == "uriFriendlyTitle") ? "title/" + param : getBy + "/" + param,
				getUmiObservable = Rx.Observable.fromPromise(getUmiPromise(url));

			getUmiObservable
				.map(function (d) {
					var response = omApi.response(d);
					return response ? response.data : false;
				})
				.where(function (data) {
					return data;
				})
				.subscribe(function (data) {
					logger.log("UMI " + getBy + " => " + param + " loaded.", "info");

					//data.umi.type = data.umi.type == "Special" ? "" : data.umi.type;

					if (classes) {
						data.targetClasses = classes;
					}
					data.where = where;

					$scope.grid[where.row][where.column] = data;
					// TODO this does not work on expanding??
					//$timeout(fadeInUmi, magicForBoard.fadeUmiTimeout);
				}, function (errorData) {
					notification.generate("There was an error loading requested contribution.", "error", errorData);
				});
		};

		// @TODO refactor a tad I guess.. bit of a hacky way
		var gridStartingPosition = $scope.rows < 3 || $scope.columns < 3 ? {
			"row": 0,
			"column": 0
		} : magicForBoard.gridStartingPosition;

		getUmi("uriFriendlyTitle", initUriFriendlyTitle, gridStartingPosition, false);

		$scope.position = function (direction, data, id) {
			var row = data.where.row,
				column = data.where.column,
				targetPosition = {row: row, column: column},
				targetClasses = [],
				newUmiId = id;

			if (direction == "up") {
				targetPosition.row = row - 1;
			}
			else if (direction == "down") {
				targetPosition.row = row + 1;
			}
			else if (direction == "left") {
				targetPosition.column = column - 1;
			}
			else if (direction == "right") {
				targetPosition.column = column + 1;
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

			getUmi("id", newUmiId, targetPosition, targetClasses.join(" "));
		};

		// We can possibly store the data in a temporary sessionStorage and given that user will click through,
		// rather than navigate via URL, we can save one HTTP call.
		$scope.edit = function (uriFriendlyTitle) {
			$location.url("/edit/" + uriFriendlyTitle);
		}
	}

})();