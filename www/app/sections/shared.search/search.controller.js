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

	function SearchController($scope, $http, $location, rx, notification, logger, magic, magicForSearch) {
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

		$scope.nNavigate = function (e, dive) {
			if (e.keyCode == magicForSearch.keyReturn) {
				e.preventDefault();

				return dive ? $scope.nGetUmi() : pressedReturn();
			} else if (e.keyCode == magicForSearch.keyUp || e.keyCode == magicForSearch.keyDown) {
				e.preventDefault();

				return pressedArrows(e.keyCode);
			}
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

		function simulateDiving(term) {
			var termLength = term ? term.length : false;

			if (document.getElementById(magicForSearch.simulateDivingDomId)
				&& termLength && termLength < magicForSearch.simulateDivingMaxTermLength) {
				var percentage = termLength * (100 / magicForSearch.simulateDivingMaxTermLength) + "%";
				document.getElementById(magicForSearch.simulateDivingDomId).style.backgroundPositionY = percentage;
			}
		}

		// @TODO consider returning a RX.Observable.fromPromise in lieu of a normal promise
		function omSearch(term) {
			return $http.get(magic.api + "search/" + term);
		}

		// There should be a nice way to not run this until a change actually happens. That is to say that
		// it should not run when $scope.searchTerm is empty.
		// @RESOLVED using filter
		//
		// What if I select all and then remove? The filter set atm will ... from removing the searchResults
		// @RESOLVED using a decent one-liner
		var source = rx.watch($scope, "searchTerm")
			.map(function (e) {
				return e.newValue;
			})
			.filter(function (term) {
				!term ? cleanSearchVars() : simulateDiving(term);

				return term;
			})
			.debounce(500) // @TODO magicVars
			.distinctUntilChanged()
			.do(function (term) {
				logger.log("Listing results for term: " + term, "info");
			})
			.flatMapLatest(omSearch)
			.retry(3); // @TODO magicVars

		var subsription = source.subscribe(function (results) {
				var data = results.data;

				if (data.length > 0) {
					$scope.searchResults = {
						"currentSelection": 0,
						"data": data
					};
				} else {
					$scope.searchResults = false;
					notification.generate("No results found :-(", "info");
				}
			},
			function (errorData) {
				notification.generate("There was an error with the connection to our API.", "error", errorData);
			});
	}

})();