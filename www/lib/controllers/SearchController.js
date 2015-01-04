var keyDown = 40;
var keyUp = 38;
var keyReturn = 13;

var simulateDivingMaxTermLength = 40;

app.controller("SearchController", function ($scope, $http) {

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

		if (e.keyCode == keyReturn) {
			e.preventDefault();

			if (_.first(callback) == "getUmi") {
				var uriFriendlyTitle = $scope.searchResults.data[$scope.searchResults.currentSelection].uriFriendlyTitle;

				$scope.$parent[callback](uriFriendlyTitle);
			} else if (_.first(callback) == "autocomplete") {
				$scope.autocomplete(callback[1]);
			}
		}

		if (e.keyCode == keyUp && searchResultsCurrentSelection > 0) {
			e.preventDefault();

			res.currentSelection = searchResultsCurrentSelection - 1;
		} else if (e.keyCode == keyDown && searchResultsCurrentSelection < (searchResultsCount - 1)) {
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

		if (termLength > 0) {
			if (dive) {
				simulateDiving(termLength);
			}

			$http.get(appConfig.apiUrl + "/search/" + term).
				success(function (data) {
					if (data.length > 0) {
						var results = {
							"currentSelection": 0,
							"data": data
						};

						$scope.searchResults = results;
					} else {
						$scope.searchResults = false;

						$scope.notify(
							"No results found :-(",
							"info", $scope.$parent.$parent
						);
					}
				}).
				error(function () {
					$scope.notify(
						"There was an error with the connection to our API.",
						"error", $scope.$parent.$parent
					);
				});
		} else {
			$scope.searchResults = false;
		}
	};

	/**
	 * Adds items user chooses to an autocompleteData object (from search results)
	 *
	 * @param searchResultsPointer {string}
	 * @param index {int}
	 *
	 * @NOTE autocompleteData might sometimes need to be specified in parent controller
	 */
	$scope.autocomplete = function(searchResultsPointer, index) {
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
	$scope.removeUmiId = function(searchResultsPointer, id) {
		delete $scope.autocompleteData[searchResultsPointer][id];
	};

	/**
	 * Makes diver go down
	 *
	 * @param termLength {int}
	 */
	var simulateDiving = function(termLength) {
		if (termLength < simulateDivingMaxTermLength) {
			var percentage = termLength * (100 / simulateDivingMaxTermLength) + "%";

			document.getElementById("masthead").style.backgroundPositionY = percentage;
		}
	};

});