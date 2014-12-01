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

	$scope.accessUrlUser = function(url) {
		if (!$scope.omUser) {
			alert("You must be logged in to Contribute to OpenMaths!");
			return false;
		}
		else {
			$location.url("/" + url);
		}
	};

});

app.controller("DiveIntoController", function ($scope, $rootScope, $http, $location) {
	$rootScope.title = "Dive Into";
	$rootScope.navTopTransparentClass = true;
	$scope.navDive = true;
	$scope.searchUmiResultsCurrentSelection = 0;

	if (sessionStorage.getItem("umiLastSearchTitle")) {
		var umiLastSearchTitle = sessionStorage.getItem("umiLastSearchTitle");
		$scope.searchUmiTerm = umiLastSearchTitle;

		if (sessionStorage.getItem("umiLastSearchResults")) {
			var umiLastSearchResults = sessionStorage.getItem("umiLastSearchResults");
			$scope.searchUmiResults = JSON.parse(umiLastSearchResults);
		}
	}

	// Percentage is merely fictional now
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

	$scope.rows = sessionStorage.getItem("gridRows") ? parseInt(sessionStorage.getItem("gridRows")) : 3;
	$scope.columns = sessionStorage.getItem("gridColumns") ? parseInt(sessionStorage.getItem("gridColumns")) : 3;

	for (i = 0; i < $scope.rows; i++) {
		var row = [];

		for (c = 0; c < $scope.columns; c++) {
			row.push(c);
		}

		$scope.grid.push(row);
	}

	$scope.addRow = function () {
		if ($scope.rows > 5) {
			return false;
		}

		$scope.rows = $scope.rows + 1;
		sessionStorage.setItem("gridRows", $scope.rows);

		var row = [];

		for (c = 0; c < $scope.columns; c++) {
			row.push(c);
		}

		$scope.grid.push(row);
	};
	$scope.removeRow = function () {
		if ($scope.rows < 3) {
			return false;
		}

		$scope.rows = $scope.rows - 1;
		sessionStorage.setItem("gridRows", $scope.rows);

		var row = [];

		for (c = 0; c < $scope.columns; c++) {
			row.push(c);
		}

		$scope.grid.pop();
	};
	$scope.addColumn = function () {
		if ($scope.columns > 5) {
			return false;
		}

		for (i = 0; i < $scope.rows; i++) {
			$scope.grid[i].push($scope.columns);
		}

		$scope.columns = $scope.columns + 1;
		sessionStorage.setItem("gridColumns", $scope.columns);
	};
	$scope.removeColumn = function () {
		if ($scope.columns < 3) {
			return false;
		}

		for (i = 0; i < $scope.rows; i++) {
			$scope.grid[i].pop();
		}

		$scope.columns = $scope.columns - 1;
		sessionStorage.setItem("gridColumns", $scope.columns);
	};

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

app.controller("ContributeController", function ($scope, $rootScope, $http, $location) {
	if (!$scope.omUser) {
		alert("You must be logged in to Contribute to OpenMaths!");
		$location.path("/");
	}

	$rootScope.title = "Contribute";
	$rootScope.navTopTransparentClass = false;

	$scope.navContribute = true;

	$scope.errorMessages = {
		required: "This field is required.",
		maxLength: "This field is exceeding the maximum length of 128 characters.",
		umiTitle: "The title should only consist of letters, spaces, or hyphens"
	};

	$scope.instructions = {
		type : "What category of information?",
		title : "Users will be able to search your contribution.",
		titleSynonyms : "Comma-separated list of alternative names.",
		latexContent : "The actual content. You are free to use LaTeX (including text-mode macros!!).",
		prerequisiteDefinitions : "Comma-separated list of valid Titles upon which your contribution depends.",
		seeAlso : "Comma-separated list of valid Titles which may be related.",
		tags : "Comma-separated list of tags to help users find your contribution.",
		dispatch: "Submitting your contribution will create a request to pull the content into our database."
	};

	$scope.umiTypes = [
		{id: "Definition", label: "Definition"},
		{id: "Axiom", label: "Axiom"},
		{id: "Theorem", label: "Theorem"},
		{id: "Lemma", label: "Lemma"},
		{id: "Corollary", label: "Corollary"},
		{id: "Conjecture", label: "Conjecture"},
		{id: "Proof", label: "Proof"},
		{id: "HistoricalNote", label: "Historical Note"},
		{id: "PhilosophicalJustification", label: "Philosophical Justification"},
		{id: "Diagram", label: "Diagram"},
		{id: "Example", label: "Example"}
	];

	$scope.createUmi = function() {
		var createUmiForm = $scope.createUmiForm;

		var dispatchCreateUmi = {
			author : $scope.omUser.email,
			message : "Initialise UMI",
			content : createUmiForm.latexContent,
			title : createUmiForm.title,
			titleSynonyms : createUmiForm.titleSynonyms ? createUmiForm.titleSynonyms : [],
			prerequisiteDefinitionIds : createUmiForm.prerequisiteDefinitions ? createUmiForm.prerequisiteDefinitions : [],
			seeAlsoIds : createUmiForm.seeAlso ? createUmiForm.seeAlso : [],
			tags : createUmiForm.tags ? createUmiForm.tags : [],
			umiType : createUmiForm.type.id
		};

		console.log(dispatchCreateUmi);

		// TODO: Abstract this as a function to make POST requests
		// TODO: Look into JSONP

		//http.onreadystatechange = function() {
		//	if(http.readyState == 4 && http.status == 200) {
		//		alert(http.responseText);
		//	}
		//};
		//
		//http.send(JSON.stringify(dispatchCreateUmi));

		var http = new XMLHttpRequest();
		var url = "http://127.0.0.1:8080/add"; //appConfig.apiUrl + "/add";
		var data = JSON.stringify(dispatchCreateUmi);

		http.open("POST", url, true);

		http.setRequestHeader("Content-type", "application/json;charset=UTF-8");
		//http.setRequestHeader("Accept", "application/json;charset=UTF-8");

		http.onload = function() {
			console.log(http);
		};

		http.onerror = function() {
			alert('Woops, there was an error making the request.');
			console.log(http);
		};

		http.send(data);
	};
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