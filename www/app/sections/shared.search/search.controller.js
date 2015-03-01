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

	function SearchController($scope, $http, $timeout, $location, rx, notification, logger, magic, magicForSearch) {
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

		$scope.nNavigate = function (e, dive) {
			if (e.keyCode == magicForSearch.keyReturn) {
				e.preventDefault();

				return dive ? $scope.nGetUmi() : pressedReturn();
			} else if (e.keyCode == magicForSearch.keyUp || e.keyCode == magicForSearch.keyDown) {
				e.preventDefault();

				return pressedArrows(e.keyCode);
			}
		};

		$scope.nSearch = function (dive) {
			var term = $scope.searchTerm;
			var termLength = term.length;

			dive ? simulateDiving(termLength) : "";

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

		//@ICEBOX
		//var promise = $http.get(magic.api + "search/b");
		//var observable = Rx.Observable.fromPromise(promise);
		//
		//observable.subscribe(
		//	function (data) {
		//		logger.log(data, "info");
		//	},
		//	function (err) {
		//		logger.log(err.message, "error");
		//	}
		//);

		//Rx.Observable.fromScopeFunction = function (scope, functionName) {
		//	return Rx.Observable.create(function (observer) {
		//		if (scope[functionName]) {
		//			var origFunction = scope[functionName];
		//			scope[functionName] = function (param) {
		//				origFunction(param);
		//				observer.onNext(param);
		//			}
		//		} else {
		//			scope[functionName] = function (param) {
		//				observer.onNext(param);
		//			}
		//		}
		//	});
		//};

		//var keyStrokeStream = Rx.Observable.fromScopeFunction($scope, "nSearch")
		//	.throttle(1000)
		//	.select(function(d) {
		//		console.log(d);
		//	});
		//
		//keyStrokeStream.subscribe(function (data) {
		//	console.log(data);
		//});


		/* Using a disposable */
		//var source = Rx.Observable.create(function (observer) {
		//	observer.onNext(42);
		//	observer.onCompleted();
		//
		//	// Note that this is optional, you do not have to return this if you require no cleanup
		//	return Rx.Disposable.create(function () {
		//		logger.log("Rx Observable disposed", "info");
		//	});
		//});
		//
		//var subscription = source.subscribe(
		//	function (x) {
		//		console.log('Next: ' + x);
		//	},
		//	function (err) {
		//		console.log('Error: ' + err);
		//	},
		//	function () {
		//		console.log('Completed');
		//	});

		// @TODO consider returning a RX.Observable.fromPromise
		function omSearch(term) {
			logger.log("Listing results for term: " + term, "info");

			return $http.get(magic.api + "search/" + term);
		}

		// There should be a nice way to not run this until a change actually happens. That is to say that
		// it should not run when $scope.searchTerm is empty.
		rx.watch($scope, 'searchTerm')
			.throttle(500)
			.map(function (e) {return e.newValue;})
			.filter(function (term) {return term;})
			.distinctUntilChanged()
			.do(function () {
				console.log("Fetching results");
			})
			.flatMapLatest(omSearch)
			.subscribe(function (data) {
				console.log(data);

				//var searchResults = [];
				//var data = promise.data;
				//
				//if (data.length > 0) {
				//	searchResults = {
				//		"currentSelection": 0,
				//		"data": data
				//	};
				//} else {
				//	searchResults = false;
				//	notification.generate("No results found :-(", "info");
				//}
				//
				//return searchResults;
			},
			function (err) {
				notification.generate("There was an error with the connection to our API.", "error", err);
			});
	}

})();