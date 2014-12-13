app.controller("ContributeController", function ($scope, $rootScope, $http, $location, $timeout, $routeParams) {
	if (!$scope.omUser) {
		alert("You must be logged in to Contribute to OpenMaths!");
		$location.path("/");
	}

	if ($routeParams.edit) {
		var splitEditParam = $routeParams.edit.split(":");

		if (splitEditParam[0] !== "edit") {
			$location.path("/contribute");
		}

		$http.get(appConfig.apiUrl + "/id/" + splitEditParam[1]).
			success(function (data) {
				$scope.editUmiData = data;
				$rootScope.title = $scope.editUmiData ? $scope.editUmiData.title : "Contribute";

				$scope.createUmiForm = {
					type: {id: data.umiType, label: data.umiType},
					title: data.title,
					titleSynonyms: data.titleSynonyms,
					latexContent: data.latexContent,
					seeAlso: data.seeAlso,
					tags: data.tags
				};
			}).
			error(function () {
				$scope.notification = {
					"message": "There was an error loading the requested contribution.",
					"type": "error",
					"act": true
				};
				$timeout(function () {
					$scope.notification.act = false;
				}, 2500);
			});
	}

	$rootScope.navTopTransparentClass = false;

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
		prerequisiteDefinitions : "Comma-separated list of valid dependency Titles.",
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
			titleSynonyms : createUmiForm.titleSynonyms ? [createUmiForm.titleSynonyms] : [],
			prerequisiteDefinitionIds : createUmiForm.prerequisiteDefinitions ? [createUmiForm.prerequisiteDefinitions] : [],
			seeAlsoIds : createUmiForm.seeAlso ? [createUmiForm.seeAlso] : [],
			tags : createUmiForm.tags ? [createUmiForm.tags] : [],
			umiType : createUmiForm.type.id
		};

		if ($scope.editUmiData) {
			var updateUmi = {
				umiId: $scope.editUmiData.id,
				author: $scope.omUser.email,
				message: "Update UMI",
				newLatex: createUmiForm.latexContent
			};
		}

		var dispatchData = $scope.editUmiData ? updateUmi : dispatchCreateUmi;

		console.log(dispatchData);

		var method = $scope.editUmiData ? ["PUT", "update-latex"] : ["POST", "add"];

		// TODO: Abstract this as a function to make POST requests
		var http = new XMLHttpRequest();
		var url = "http://127.0.0.1:8080/" + method[1]; //appConfig.apiUrl + "/add";
		var data = JSON.stringify(dispatchData);

		http.open(method[0], url, true);

		console.log(method);

		http.setRequestHeader("Content-type", "application/json;charset=UTF-8");

		http.onload = function(e) {
			console.log(e);
			$scope.notification = {
				"message": "Your contribution was successfully posted!",
				"type": "success",
				"act": true
			};
			$timeout(function () {
				$scope.notification.act = false;
			}, 2500);
		};

		http.onerror = function(e) {
			$scope.notification = {
				"message": "There was an error making the request. Please check your contribution again before posting",
				"type": "error",
				"act": true
			};
			$timeout(function () {
				$scope.notification.act = false;
			}, 2500);
		};

		http.send(data);
	};

	$scope.search = function (name) {
		var searchTerm = $scope.createUmiForm[name];

		var termLength = searchTerm.length;

		if (termLength > 0) {
			$http.get(appConfig.apiUrl + "/search/" + searchTerm).
				success(function (data) {
					$scope.searchResults = {};

					var results = {
						"currentSelection": 0,
						"data": data
					}

					$scope.searchResults[name] = results;

					console.log($scope.searchResults);
				}).
				error(function (data, status) {
					alert("No data to display :-(");
					console.log(data + " | " + status);
				});
		}
		else {
			$scope.searchResults = false;
		}
	};
});