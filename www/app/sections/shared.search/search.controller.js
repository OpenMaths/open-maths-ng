(function () {
	"use strict";

	angular
		.module("omApp")
		.controller("SearchController", SearchController)
		.constant("magicForSearch", {
			keyDown: 40,
			keyUp: 38,
			keyReturn: 13,
			simulateDivingMaxTermLength: 40,
			simulateDivingDomId: "page-layout",
			keyboardDelay: 250
		});

	function SearchController($scope, $http, $timeout, $location, notification, logger, magic, magicForSearch) {
		// @NOTE This is to store the $timeout promise,
		// so it can be reset on every keystroke.
		var makeSearchCall;

		/**
		 * Search results arrow navigation functionality
		 *
		 * @param res {object} currentSelection, data
		 * @param e {object} $event
		 * @param callback {array}
		 * @returns {boolean}
		 */
		$scope.searchResultsNavigate = function (res, e, callback) {
			if (!res) {
				return false;
			}

			var searchResultsCount = _.keys(res.data).length;
			var searchResultsCurrentSelection = res.currentSelection;

			if (e.keyCode == magicForSearch.keyReturn) {
				e.preventDefault();

				if (_.first(callback) == "getUmi") {
					var uriFriendlyTitle = $scope.searchResults.data[$scope.searchResults.currentSelection].uriFriendlyTitle;

					$scope[callback](uriFriendlyTitle);
				} else if (_.first(callback) == "autocomplete") {
					$scope.autocomplete(callback[1]);
				}
			}

			if (e.keyCode == magicForSearch.keyUp && searchResultsCurrentSelection > 0) {
				e.preventDefault();

				res.currentSelection = searchResultsCurrentSelection - 1;
			} else if (e.keyCode == magicForSearch.keyDown && searchResultsCurrentSelection < (searchResultsCount - 1)) {
				e.preventDefault();

				res.currentSelection = searchResultsCurrentSelection + 1;
			}

			return false;
		};

		/**
		 * Executes search against our BE
		 *
		 * @param model {string}
		 * @param autocomplete {boolean}
		 * @param dive {boolean}
		 */
		$scope.search = function (model, autocomplete, dive) {
			if (autocomplete) {
				$scope.showAutocomplete = true;
			}

			var term = function (path, object) {
				var currentPath = path.split(".");
				var pointer = _.first(currentPath);

				if (currentPath.length > 1) {
					currentPath.reverse().pop();

					return term(currentPath.reverse().join("."), $scope[pointer]);
				}

				return object ? object[pointer] : $scope[pointer];
			};

			var term = term(model, false);
			var termLength = term.length;

			if (dive) {
				simulateDiving(termLength);
			}

			if (termLength < 1) {
				$scope.searchResults = false;

				return false;
			} else {
				$timeout.cancel(makeSearchCall);

				makeSearchCall = $timeout(function () {
				}, magicForSearch.keyboardDelay);
			}

			makeSearchCall.then(function () {
				$http.get(magic.api + "search/" + term).success(function (data) {
					logger.log("Listing results for term: " + term, "info");

					if (data.length > 0) {
						var results = {
							"currentSelection": 0,
							"data": data
						};

						$scope.searchResults = results;
					} else {
						$scope.searchResults = false;

						notification.generate("No results found :-(", "info");
					}
				}).error(function (data) {
					notification.generate("There was an error with the connection to our API.", "error", data);
				});
			});
		};

		/**
		 * Adds items user chooses to an autocompleteData object (from search results)
		 *
		 * @param searchResultsPointer {string}
		 * @param index {int}
		 *
		 * @NOTE autocompleteData might sometimes need to be specified in parent controller
		 */
		$scope.autocomplete = function (searchResultsPointer, index) {
			var results = $scope.searchResults;

			// If hitting enter rather than clicking
			var assignFromResults = !index ? results.data[results.currentSelection] : results.data[index];

			// NOTE this is resetting the currently open results container
			$scope.createUmiForm[searchResultsPointer] = "";
			$scope.showAutocomplete = false;
			$scope.searchResults = false;

			// if autocompleteData with particular results pointer is already set:
			if ($scope.autocompleteData[searchResultsPointer]) {
				$scope.autocompleteData[searchResultsPointer][assignFromResults.id] = assignFromResults.title;
			} else {
				var assignData = {};
				assignData[assignFromResults.id] = assignFromResults.title;

				$scope.autocompleteData[searchResultsPointer] = assignData;
			}
		};

		/**
		 * Removes an item from autocomplete data
		 *
		 * @param searchResultsPointer {string}
		 * @param id {id}
		 */
		$scope.removeUmiId = function (searchResultsPointer, id) {
			delete $scope.autocompleteData[searchResultsPointer][id];
		};

		$scope.getUmi = function (uri) {
			if (!uri) {
				notification.generate("No URI argument present", "error");

				return false;
			}

			$location.path("/board/" + uri);
		};

		/**
		 * Makes diver go down
		 *
		 * @param termLength {int}
		 */
		var simulateDiving = function (termLength) {
			if (termLength < magicForSearch.simulateDivingMaxTermLength) {
				var percentage = termLength * (100 / magicForSearch.simulateDivingMaxTermLength) + "%";

				document.getElementById(magicForSearch.simulateDivingDomId).style.backgroundPositionY = percentage;
			}
		};

		$scope.nRemoveTag = function (id) {
			delete $scope.autocompleteData[id];
		};

		$scope.nAutocomplete = function (index) {
			var selectedItem = $scope.searchResults.data[index];

			$scope.autocompleteData[selectedItem.id] = selectedItem.title;

			$scope.searchTerm = "";
			$scope.searchResults = "";

			return false;
		};

		$scope.nConfirm = function (e) {
			if (e.keyCode == magicForSearch.keyReturn) {
				e.preventDefault();
				return pressedReturn();
			}
		};

		$scope.nSearch = function (e) {
			if (e.keyCode == magicForSearch.keyUp || e.keyCode == magicForSearch.keyDown) {
				e.preventDefault();
				return pressedArrows(e.keyCode);
			}

			var term = $scope.searchTerm;
			var termLength = term.length;

			if (termLength < 1) {
				$scope.searchResults = false;
				return false;
			} else {
				$timeout.cancel(makeSearchCall);
				makeSearchCall = $timeout(function () {
				}, magicForSearch.keyboardDelay);
			}

			makeSearchCall.then(function () {
				$http.get(magic.api + "search/" + term).success(function (data) {
					logger.log("Listing results for term: " + term, "info");

					if (data.length > 0) {
						$scope.searchResults = {
							"currentSelection": 0,
							"data": data
						};
					} else {
						$scope.searchResults = false;

						notification.generate("No results found :-(", "info");
					}
				}).error(function (data) {
					notification.generate("There was an error with the connection to our API.", "error", data);
				});
			});
		};

		function pressedArrows(key) {
			if (!$scope.searchResults) {
				return false;
			}

			var searchResultsCount = _.keys($scope.searchResults.data).length;
			var searchResultsCurrentSelection = $scope.searchResults.currentSelection;

			if (key == magicForSearch.keyUp && searchResultsCurrentSelection > 0) {
				$scope.searchResults.currentSelection = searchResultsCurrentSelection - 1;
			} else if (key == magicForSearch.keyDown && searchResultsCurrentSelection < (searchResultsCount - 1)) {
				$scope.searchResults.currentSelection = searchResultsCurrentSelection + 1;
			}

			return false;
		}

		function pressedReturn() {
			if (!$scope.searchResults) {
				return false;
			}

			var searchResultsCurrentSelection = $scope.searchResults.currentSelection;
			var selectedItem = $scope.searchResults.data[searchResultsCurrentSelection];

			$scope.autocompleteData[selectedItem.id] = selectedItem.title;

			$scope.searchTerm = "";
			$scope.searchResults = "";

			return false;
		}
	}

})();