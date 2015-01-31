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

		$scope.nGetUmi = function (index) {
			if (!$scope.searchResults) {
				notification.generate("No URI argument present", "error");

				return false;
			}

			var searchResultsCurrentSelection = _.isUndefined(index) ? $scope.searchResults.currentSelection : index;
			var selectedItem = $scope.searchResults.data[searchResultsCurrentSelection];

			$location.path("/board/" + selectedItem.uriFriendlyTitle);
		};

		$scope.nRemoveTag = function (id) {
			delete $scope.autocompleteData[id];
		};

		$scope.nAutocomplete = function (index) {
			var selectedItem = $scope.searchResults.data[index];

			$scope.autocompleteData[selectedItem.id] = selectedItem.title;

			return cleanSearchVars();
		};

		$scope.nNavigate = function(e, dive) {
			if (e.keyCode == magicForSearch.keyReturn) {
				e.preventDefault();

				return dive ? $scope.nGetUmi() : pressedReturn();
			} else if (e.keyCode == magicForSearch.keyUp || e.keyCode == magicForSearch.keyDown) {
				e.preventDefault();

				return pressedArrows(e.keyCode);
			}
		};

		$scope.nSearch = function (e, dive) {
			var term = $scope.searchTerm;
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

			return cleanSearchVars();
		}

		function cleanSearchVars() {
			$scope.searchTerm = "";
			$scope.searchResults = "";

			return false;
		}

		function simulateDiving(termLength) {
			if (termLength < magicForSearch.simulateDivingMaxTermLength) {
				var percentage = termLength * (100 / magicForSearch.simulateDivingMaxTermLength) + "%";

				document.getElementById(magicForSearch.simulateDivingDomId).style.backgroundPositionY = percentage;
			}
		}
	}

})();