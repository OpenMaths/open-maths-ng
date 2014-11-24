app.controller("GlobalController", function ($scope, $location, $window, $http) {

	// This is a test function that will run on page load.
	console.log("OpenMaths is now running");

	$scope.$watch(function () {
		return $location.path();
	}, returnPath);

	function returnPath() {
		var splitUrl = $location.url().split("/");
		$scope.path = splitUrl[1] == "" ? "board" : splitUrl[1];

		$window.ga("send", "pageview", {page: $location.path()});
	}

	$scope.themeClass = "light";
	$scope.setTheme = function (theme) {
		$scope.themeClass = theme;
	};

	$scope.umiFontClass = "umi-font-modern";
	$scope.setUmiFont = function (font) {
		$scope.umiFontClass = font;
	};

	if (sessionStorage.getItem("omUser")) {
		var omUserString = sessionStorage.getItem("omUser");
		$scope.omUser = JSON.parse(omUserString);
	}


	$scope.googleSignIn = function () {
		gapi.auth.signIn({
			"callback": function (authResult) {
				if (authResult["status"]["signed_in"]) {
					var token = gapi.auth.getToken();

					$http.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token.access_token).
						success(function (data) {
							$scope.omUser = data;
							sessionStorage.setItem("omUser", JSON.stringify(data));
						}).error(function (data , status) {
							console.log("No data to display :-(");
							console.log(data + " | " + status);
						});
				} else {
					console.log("Sign-in state: " + authResult["error"]);
				}
			}
		});
	};

});

app.controller("BoardController", function ($scope, $rootScope, $http, $timeout) {
	$rootScope.title = "Board";
	$rootScope.navTopTransparentClass = true;
	$scope.navBoard = true;

	// TODO: implement arrow navigation in results (highlighting and selection)
	$scope.searchUmiResultsNavigate = function (e) {
		if (e.keyCode == 38)
			alert("up arrow");
		else if (e.keyCode == 40)
			alert("down arrow");
	};

	$scope.searchUmiKeyDown = function () {
		var termLength = $scope.searchUmiTerm.length;
		var percentage = termLength * 2.5 + "%";

		if (termLength < 40) {
			document.getElementById("board-holder").style.backgroundPositionY = percentage;
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
					console.log("No data to display :-(");
					console.log(data + " | " + status);
				});
		}
		else {
			$scope.searchUmiResults = false;
		}
	};

	$http.get("https://api.github.com/orgs/OpenMaths/events?per_page=25").
		success(function (data) {
			$scope.gitHubFeed = data;
		}).
		error(function (data) {
			console.log(data);
		});

	$scope.grid = [];

	for (i = 0; i < 3; i++) {
		var row = [];

		row.push(1);
		row.push(2);
		row.push(3);

		$scope.grid.push(row);
	}

	$scope.getUmi = function (id) {
		if (!id) {
			if (!$scope.searchUmiResults) {
				return false;
			}

			id = $scope.searchUmiResults[0]["id"];
		}
		$http.get(appConfig.apiUrl + "/id/" + id).
			success(function (data, status) {
				$rootScope.showGrid = true;
				$rootScope.navTopTransparentClass = false;

				data.classes = [];
				$scope.grid[1][1] = data;

				var fadeInUmi = function () {
					$scope.fadeInUmi = true;
				};

				$timeout(fadeInUmi, 250);
			}).
			error(function (data, status) {

				// TODO: change this to a more semantic system of displaying errors
				console.log("No data to display :-(");

				console.log(data + " | " + status);
			});
	};

	$scope.position = function (row, column, direction, newUmiID) {
		var targetClasses = [];

		// TODO: resolve add unique classes only once!
		if (direction == "up") {
			var targetPosition = [row - 1, column];
			$scope.grid[row][column].classes.push("opens-top");
		} else if (direction == "down") {
			var targetPosition = [row + 1, column];
			$scope.grid[row][column].classes.push("opens-bottom");
		} else if (direction == "left") {
			var targetPosition = [row, column - 1];
			$scope.grid[row][column].classes.push("opens-left");
		} else if (direction == "right") {
			var targetPosition = [row, column + 1];
			$scope.grid[row][column].classes.push("opens-right");
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
				data.classes = [];
				data.closingClasses = targetClasses.join(" ");
				$scope.grid[targetPosition[0]][targetPosition[1]] = data;
			}).
			error(function (data, status) {
				console.log("No data to display :-(");
				console.log(data + " | " + status);
			});

	};

	$scope.navTopControls = {};

	$scope.seeAlso = function (alsos, prerequisites) {
		$scope.navTopControls.seeAlso = alsos;
		$scope.navTopControls.prerequisiteDefinitions = prerequisites;
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