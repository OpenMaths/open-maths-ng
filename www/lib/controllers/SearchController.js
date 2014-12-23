app.controller("SearchController", function ($scope, $http) {

	/**
	 * Search functionality
	 *
	 * @param res {object} currentSelection, data
	 * @param e {object} $event
	 * @returns {boolean}
	 *
	 * @TODO: Turn into a factory?
	 * @TODO: Dispatch event on Return key?
	 */
	$scope.searchResultsNavigate = function (res, e) {
		if (!res) {
			return false;
		}

		var searchResultsCount = _.keys(res.data).length;
		var searchResultsCurrentSelection = res.currentSelection;

		// TODO finish!
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

	// TODO what if the model is a multi-dimensional array?
	$scope.search = function (model, key) {
		var term = $scope[model];
		var termLength = term.length;

		if (termLength > 0) {
			$http.get(appConfig.apiUrl + "/search/" + term).
				success(function (data) {
					if (data.length > 0) {
						$scope.searchResults = {};

						var results = {
							"currentSelection": 0,
							"data": data
						};

						$scope.searchResults[key] = results;
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

});