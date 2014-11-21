app.controller("GlobalController", function ($scope, $location, $window) {

	// This is a test function that will run on page load.
	console.log("OpenMaths is now running");

	// This watches changes in URL and therefore makes it possible to assign
	// classes and all sorts of dependencies dynamically.
	$scope.$watch(function () {
		return $location.path();
	}, returnPath);

	// This returns the current page name. It is basically the value after the
	// forward slash in the URL, and it helps create custom body classes for
	// specific styling.
	function returnPath() {
		var splitUrl = $location.url().split("/");
		$scope.path = splitUrl[1] == "" ? "home" : splitUrl[1];

		$window.ga("send", "pageview", {page: $location.path()});
	}

});

app.controller("HomeController", function ($scope, $rootScope, $http) {
	$rootScope.title = "Home";

	$http.get("https://api.github.com/orgs/OpenMaths/events?per_page=50").
		success(function (data) {
			$scope.githubFeed = data;
			// data.forEach(function(entry) {
			// 	if (entry["type"] == "PushEvent") {
			// 		var date = new Date(entry["created_at"]);

			// 		console.log(date.getDay());
			// 	}
			// });
		}).
		error(function (data, status, headers, config) {
			console.log(data);
		});

	$scope.requestUmi = function () {

		$http.get(appConfig.apiUrl + "/umi/" + $scope.requestId).
			success(function (data, status, headers, config) {
				$scope.data = data;
			}).
			error(function (data, status, headers, config) {
				$scope.data = "No data to display :-(";
			});

	};
});

app.controller("EditorController", function ($scope, $rootScope) {
	$rootScope.title = "Editor";
});

app.controller("BoardController", function ($scope, $rootScope, $http) {
	$rootScope.title = "Board";

	$scope.grid = [];

	for (i = 0; i < 3; i++) {
		var row = [];

		row.push(1);
		row.push(2);
		row.push(3);

		$scope.grid.push(row);
	}

	$http.get(appConfig.apiUrl + "?umi=" + 2).
		success(function (data, status, headers, config) {
			$scope.grid[1][1] = data;
		}).
		error(function (data, status, headers, config) {

			// TODO: change this to a more semantic system of displaying errors
			alert("No data to display :-(");

			console.log(data + " | " + status + " | " + headers + " | " + config);
		});

	$scope.position = function(row, column, direction, newUmiID) {
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

		$http.get(appConfig.apiUrl + "?umi=" + newUmiID).
			success(function (data, status, headers, config) {
				data.closingClasses = targetClasses.join(" ");
				$scope.grid[targetPosition[0]][targetPosition[1]] = data;
			}).
			error(function (data, status, headers, config) {

				// TODO: change this to a more semantic system of displaying errors
				alert("No data to display :-(");

				console.log(data + " | " + status + " | " + headers + " | " + config);
			});

	};

});

app.controller("UmiController", function ($scope, $http, $rootScope) {

	// TODO: move templates to separate file
	var templates = {};

	templates.umi = function (id, data, position) {
		return '<div class="umi {{ umiOpeningDirectionClass }}" ng-controller="UmiController" ng-init="position=[' + position[0] + ',' + position[1] + ']">' +
		'<div class="content-holder">' +
		'<div class="title">' +
		'<label class="proof">' + data.umiType + '</label>' +
		'<strong>{{ title }}' + data.title + '</strong>' +
		'</div>' +
		'<article>' + data.latex + '</article>' +
		'</div>' +
		'</div>';
	};

	$scope.expand = function (direction) {
		var newUmiID = $scope.newUmiID;
		var position = $scope.position;
		var newUmiData;

		if (direction == "up") {
			position[0] = $scope.position[0] - 1;

			$scope.umiOpeningDirectionClass = "opens-top";
		}

		$http.get(appConfig.apiUrl + "/umi/" + newUmiID + ".json").
			success(function (data, status, headers, config) {

				newUmiData = data;

				$rootScope.row1col2 = templates.umi(newUmiID, newUmiData, position);

				//$(".row[data-row=" + position[0] + "] .column[data-column=" + position[1] + "]").
				//	html(templates.umi(newUmiID, newUmiData, position));

			}).
			error(function (data, status, headers, config) {

				// TODO: change this to a more semantic system of displaying errors
				alert("No data to display :-(");

				console.log(data + " | " + status + " | " + headers + " | " + config);
			});

	};
});

app.controller("OoopsController", function ($scope, $rootScope) {
	$rootScope.title = "Ooops";
});

app.controller("SassController", function ($scope, $rootScope, $location) {
	$rootScope.title = "SASS Library";
});
