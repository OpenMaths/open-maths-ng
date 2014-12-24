app.controller("SearchController", function ($scope, $http) {

	/**
	 * Search results arrow navigation functionality
	 *
	 * @param res {object} currentSelection, data
	 * @param e {object} $event
	 * @returns {boolean}
	 *
	 * @TODO: Dispatch event on Return key?
	 */
	$scope.searchResultsNavigate = function (res, e) {
		if (!res) {
			return false;
		}

		var searchResultsCount = _.keys(res.data).length;
		var searchResultsCurrentSelection = res.currentSelection;

		// TODO decide what to do w/ this! Add a callback function?
		//if (e.keyCode == 13) {
		//	e.preventDefault();
		//}

		if (e.keyCode == 38 && searchResultsCurrentSelection > 0) {
			e.preventDefault(); //needed?

			res.currentSelection = searchResultsCurrentSelection - 1;
		} else if (e.keyCode == 40 && searchResultsCurrentSelection < (searchResultsCount - 1)) {
			e.preventDefault(); //needed?

			res.currentSelection = searchResultsCurrentSelection + 1;
		}

		return false;
	};

	$scope.search = function (model, autocomplete) {
		if (autocomplete) {
			$scope.showAutocomplete = true;
		}

		var term = function (path, object) {
			var currentPath = path.split('.');
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
			// TODO finish & outsource
			//if (termLength < 40) {
			//	var percentage = termLength * 2.5 + "%";
			//
			//	document.getElementById("masthead").style.backgroundPositionY = percentage;
			//}

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
					}
				}).
				error(function (data, status) {
					// TODO change to a more meaningful way of showing there is a problem
					alert("No data to display :-(");
					console.log(data + " | " + status);
				});
		} else {
			$scope.searchResults = false;
		}
	};

	// NOTE autocompleteData sometimes might need to be specified in parent controller
	$scope.autocomplete = function(searchResultsPointer, index) {
		var results = $scope.searchResults;

		// If hitting enter rather than clicking
		var assignFromResults = !index ? results.data[results.currentSelection] : results.data[index];

		$scope.createUmiForm[searchResultsPointer] = "";
		$scope.showAutocomplete = false;

		// if autocompleteData with particular results pointer is already set:
		if ($scope.autocompleteData[searchResultsPointer]) {
			$scope.autocompleteData[searchResultsPointer][assignFromResults.id] = assignFromResults.title;
		} else {
			var assignData = {};
			assignData[assignFromResults.id] = assignFromResults.title;

			$scope.autocompleteData[searchResultsPointer] = assignData;
		}
	};

	$scope.removeUmiId = function(searchResultsPointer, id) {
		delete $scope.autocompleteData[searchResultsPointer][id];
	};

});