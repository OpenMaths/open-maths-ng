(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("manageGrid", manageGridFactory)
		.constant("magicForManageGridFactory", {
			gridMaxRows: 6,
			gridMinRows: 2,
			gridMaxColumns: 6,
			gridMinColumns: 2
		});

	function manageGridFactory(magicForManageGridFactory) {
		var factory = {
			row: manageRow,
			column: manageColumn
		};

		return factory;

		function manageRow(method, rows, columns) {
			switch (method) {
				case "add":
					if (rows > (magicForManageGridFactory.gridMaxRows - 1)) {
						return false;
					}

					var row = [];
					for (var i = 0; i < columns; i++) {
						row.push(i);
					}

					return {newRowsNumber: rows + 1, newRow: row};
				case "remove":
					if (rows < (magicForManageGridFactory.gridMinRows + 1)) {
						return false;
					}

					return {newRowsNumber: rows - 1, newRow: false};
				default:
					logger.log("Method " + method + " not allowed", "debug");
					return false;
			}
		}

		function manageColumn(method, columns) {
			switch (method) {
				case "add":
					if (columns > (magicForManageGridFactory.gridMaxColumns - 1)) {
						return false;
					}

					return {newColumnsNumber: columns + 1, operation: "push"};
				case "remove":
					if (columns < (magicForManageGridFactory.gridMinColumns + 1)) {
						return false;
					}

					return {newColumnsNumber: columns - 1, operation: "pop"};
				default:
					logger.log("Method " + method + " not allowed", "debug");
					return false;
			}
		}
	}

})();