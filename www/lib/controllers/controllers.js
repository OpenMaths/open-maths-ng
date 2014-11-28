app.controller("GlobalController", function ($scope, $location, $window, $http) {

	// This is a test function that will run on page load.
	console.log("OpenMaths is now running");

	$scope.$watch(function () {
		return $location.path();
	}, returnPath);

	function returnPath() {
		var splitUrl = $location.url().split("/");
		$scope.path = splitUrl[1] == "" ? "dive-into" : splitUrl[1];

		$window.ga("send", "pageview", {page: $location.path()});
	}

	$scope.themeClass = localStorage.getItem("themeClass") ? localStorage.getItem("themeClass") : "light";
	$scope.setTheme = function (theme) {
		$scope.themeClass = theme;
		localStorage.setItem("themeClass", theme);
	};

	$scope.umiFontClass = localStorage.getItem("umiFontClass") ? localStorage.getItem("umiFontClass") : "umi-font-modern";
	$scope.setUmiFont = function (font) {
		$scope.umiFontClass = font;
		localStorage.setItem("umiFontClass", font);
	};

	if (sessionStorage.getItem("omUser")) {
		var omUserString = sessionStorage.getItem("omUser");
		$scope.omUser = JSON.parse(omUserString);
	}

	$scope.googleSignOut = function () {
		gapi.auth.signOut();

		$scope.omUser = false;
		sessionStorage.removeItem("omUser");

		$location.path("/");
	};

	$scope.googleSignIn = function () {
		if ($scope.omUser) {
			return false;
		}

		gapi.auth.signIn({
			"callback": function (authResult) {
				if (authResult["status"]["signed_in"]) {
					var token = gapi.auth.getToken();

					$http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token.access_token).
						success(function (data) {
							$scope.omUser = data;
							sessionStorage.setItem("omUser", JSON.stringify(data));
						}).error(function (data, status) {
							alert("No data to display :-(");
							console.log(data + " | " + status);
						});
				} else {
					alert(authResult["error"]);
					console.log("Sign-in state: " + authResult["error"]);
				}
			}
		});
	};

});

app.controller("DiveIntoController", function ($scope, $rootScope, $http, $location) {
	$rootScope.title = "Dive Into";
	$rootScope.navTopTransparentClass = true;
	$scope.navDive = true;
	$scope.searchUmiResultsCurrentSelection = 0;

	if (sessionStorage.getItem("umiLastSearch")) {
		var umiLastSearchTitle = sessionStorage.getItem("umiLastSearchTitle");
		$scope.searchUmiTerm = umiLastSearchTitle;

		if (sessionStorage.getItem("umiLastSearch")) {
			var umiLastSearchResults = sessionStorage.getItem("umiLastSearchResults");
			$scope.searchUmiResults = JSON.parse(umiLastSearchResults);
		}
	}

	$scope.searchUmiKeyDown = function () {
		var termLength = $scope.searchUmiTerm.length;
		var percentage = termLength * 2.5 + "%";

		if (termLength < 40) {
			document.getElementById("masthead").style.backgroundPositionY = percentage;
		}

		if (termLength > 0) {
			$http.get(appConfig.apiUrl + "/search/" + $scope.searchUmiTerm).
				success(function (data) {
					var scoreMetric = 100 / (data.length + 1);
					var scoreMultiplier = 1;

					for (i = data.length; --i >= 0;) {
						var scoreValue = Math.floor(scoreMetric * scoreMultiplier) + "%";
						data[i].score = scoreValue;
						scoreMultiplier = scoreMultiplier + 1;
					}

					$scope.searchUmiResults = data;
				}).
				error(function (data, status) {
					alert("No data to display :-(");
					console.log(data + " | " + status);
				});
		}
		else {
			$scope.searchUmiResults = false;
		}
	};

	$scope.getUmi = function (id) {
		if (!id) {
			if (!$scope.searchUmiResults) {
				return false;
			}

			id = $scope.searchUmiResults[$scope.searchUmiResultsCurrentSelection]["id"];
		}

		sessionStorage.setItem("umiLastSearchTitle", $scope.searchUmiTerm);
		sessionStorage.setItem("umiLastSearchResults", JSON.stringify($scope.searchUmiResults));

		$location.path("/board/" + id);
	};

	$http.get("https://api.github.com/orgs/OpenMaths/events?per_page=25").
		success(function (data) {
			$scope.gitHubFeed = data;
		}).
		error(function (data) {
			console.log(data);
		});


	$scope.searchUmiResultsNavigate = function (e) {
		if (!$scope.searchUmiResults) {
			return false;
		}

		var resultsCount = Object.keys($scope.searchUmiResults).length;

		if (e.keyCode == 38 && $scope.searchUmiResultsCurrentSelection > 0) {
			$scope.searchUmiResultsCurrentSelection = $scope.searchUmiResultsCurrentSelection - 1;
		} else if (e.keyCode == 40 && $scope.searchUmiResultsCurrentSelection < (resultsCount - 1)) {
			$scope.searchUmiResultsCurrentSelection = $scope.searchUmiResultsCurrentSelection + 1;
		}
	};
});

app.controller("BoardController", function ($scope, $rootScope, $http, $timeout, $routeParams) {
	$rootScope.title = "Board";
	$rootScope.navTopTransparentClass = false;
	$scope.navBoard = true;

	$scope.grid = [];

	for (i = 0; i < 3; i++) {
		var row = [];

		row.push(1);
		row.push(2);
		row.push(3);

		$scope.grid.push(row);
	}

	var initId = $routeParams.id;

	$http.get(appConfig.apiUrl + "/id/" + initId).
		success(function (data, status) {
			$scope.grid[1][1] = data;

			var fadeInUmi = function () {
				$scope.fadeInUmi = true;
			};

			$timeout(fadeInUmi, 250);
		}).
		error(function (data, status) {
			alert("No data to display :-(");
			console.log(data + " | " + status);
		});

	$scope.position = function (row, column, direction, newUmiID) {
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
		} else if (targetPosition[0] == 2) {
			targetClasses.push("closes-bottom");
		} else if (targetPosition[1] == 0) {
			targetClasses.push("closes-left");
		} else if (targetPosition[1] == 2) {
			targetClasses.push("closes-right");
		}

		$http.get(appConfig.apiUrl + "/id/" + newUmiID).
			success(function (data) {
				data.closingClasses = targetClasses.join(" ");
				$scope.grid[targetPosition[0]][targetPosition[1]] = data;
			}).
			error(function (data, status) {
				alert("No data to display :-(");
				console.log(data + " | " + status);
			});

	};
});

app.controller("ContributeController", function ($scope, $rootScope) {
	$rootScope.title = "Contribute";
	$rootScope.navTopTransparentClass = false;

	$scope.navContribute = true;
});

app.controller("FeaturesController", function ($scope, $rootScope) {
	$rootScope.title = "Features";
	$rootScope.navTopTransparentClass = true;

	$scope.navFeatures = true;
});

app.controller("OoopsController", function ($scope, $rootScope) {
	$rootScope.title = "Ooops";
});

app.controller("SassController", function ($scope, $rootScope, $location) {
	$rootScope.title = "SASS Library";
});