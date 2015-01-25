(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("boardLayout", boardDirective)
		.constant("magicForBoardDirective", {
			fadeUmiTimeout: 250,
			gridDefaultRowCount: 3,
			gridDefaultColumnCount: 3,
			gridMaxRows: 6,
			gridMinRows: 2,
			gridMaxColumns: 6,
			gridMinColumns: 2,
			gridStartingPosition: {
				"row": 1,
				"column": 1
			}
		});

	function boardDirective($routeParams, $http, $timeout, $location, notification, sStorage, logger, magic, magicForBoardDirective) {
		var directive = {
			restrict: "EA",
			templateUrl: "app/sections/section.board/board.layout.html",
			link: linker
		};

		return directive;

		function linker(scope) {
			scope.rows = sStorage.get("gridRows") ? _.parseInt(sStorage.get("gridRows")) : magicForBoardDirective.gridDefaultRowCount;
			scope.columns = sStorage.get("gridColumns") ? _.parseInt(sStorage.get("gridColumns")) : magicForBoardDirective.gridDefaultColumnCount;

			var initUriFriendlyTitle = $routeParams.uriFriendlyTitle ? $routeParams.uriFriendlyTitle : false;
			var grid = [];

			for (var i = 0; i < scope.rows; i++) {
				var row = [];

				for (var c = 0; c < scope.columns; c++) {
					row.push(c);
				}
				grid.push(row);
			}

			scope.grid = grid;

			/**
			 * Manages the grid layout
			 *
			 * @param method {string} add | remove
			 * @param type {string} row | column
			 * @returns {boolean}
			 */
			scope.manageGrid = function (method, type) {
				if (type == "row") {
					var row = [];

					for (var i = 0; i < scope.columns; i++) {
						row.push(i);
					}

					switch (method) {
						case "add":
							if (scope.rows > (magicForBoardDirective.gridMaxRows - 1)) {
								return false;
							}

							scope.rows = scope.rows + 1;
							scope.grid.push(row);
							break;
						case "remove":
							if (scope.rows < (magicForBoardDirective.gridMinRows + 1)) {
								return false;
							}

							scope.rows = scope.rows - 1;
							scope.grid.pop();
							break;
						default:
							logger.log("Method" + method + "not allowed", "debug");
							return false;
					}

					sStorage.set("gridRows", scope.rows);
					return true;
				} else if (type == "column") {
					switch (method) {
						case "add":
							if (scope.columns > (magicForBoardDirective.gridMaxColumns - 1)) {
								return false;
							}

							for (var i = 0; i < scope.rows; i++) {
								scope.grid[i].push(scope.columns);
							}
							scope.columns = scope.columns + 1;
							break;
						case "remove":
							if (scope.columns < (magicForBoardDirective.gridMinColumns + 1)) {
								return false;
							}

							for (i = 0; i < scope.rows; i++) {
								scope.grid[i].pop();
							}
							scope.columns = scope.columns - 1;
							break;
						default:
							logger.log("Method" + method + "not allowed", "debug");
							return false;
					}

					sStorage.set("gridColumns", scope.columns);
					return true;
				}

				logger.log("Type" + type + "not allowed", "debug");
				return false;
			};

			/**
			 * Gets umi, either from URL or as a new expansion
			 *
			 * @param getBy {string}
			 * @param param {string}
			 * @param where {object}
			 * @param classes {string | boolean}
			 */
			var getUmi = function (getBy, param, where, classes) {
				if (param === false) {
					notification.generate("A parameter must be present to access this section. Try navigating through search.", "info");
					$location.url("/");

					return false;
				}

				var fadeInUmi = function () {
					scope.fadeInUmi = true;
				};

				var url = (getBy == "uriFriendlyTitle") ? magic.api + param : magic.api + getBy + "/" + param;

				$http.get(url).
					success(function (data) {
						logger.log("UMI " + getBy + " => " + param + " loaded.", "info");

						if (classes) {
							data.targetClasses = classes;
						}

						scope.grid[where.row][where.column] = data;
						// TODO this does not work on expanding??
						$timeout(fadeInUmi, magicForBoardDirective.fadeUmiTimeout);
					}).
					error(function (data) {
						notification.generate("There was an error loading requested contribution.", "error", data);
					});
			};

			getUmi("uriFriendlyTitle", initUriFriendlyTitle, magicForBoardDirective.gridStartingPosition, false);

			/**
			 * Position elements correctly within a grid
			 *
			 * @param row {int}
			 * @param column {int}
			 * @param direction {string}
			 * @param newUmiID {string}
			 */
			scope.position = function (row, column, direction, newUmiID) {
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
				} else if (targetPosition[0] == (scope.rows - 1)) {
					targetClasses.push("closes-bottom");
				} else if (targetPosition[1] == 0) {
					targetClasses.push("closes-left");
				} else if (targetPosition[1] == (scope.columns - 1)) {
					targetClasses.push("closes-right");
				}

				var targetPosition = {
					"row": targetPosition[0],
					"column": targetPosition[1]
				};

				getUmi("id", newUmiID, targetPosition, targetClasses.join(" "));
			};
		}
	}

})();