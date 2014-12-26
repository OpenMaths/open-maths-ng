app.controller("ContributeController", function ($scope, $rootScope, $http, $location, $timeout, $routeParams) {
	if (!$scope.omUser) {
		alert("You must be logged in to Contribute to OpenMaths!");
		$location.path("/");
	}

	$rootScope.title = "Contribute";

	// The refactoring of this coming soon!!
	$rootScope.navTopTransparentClass = false;

	// This is here on purpose as we alter autocompleteData from a child controller
	$scope.autocompleteData = {};

	if ($routeParams.edit) {
		var splitEditParam = $routeParams.edit.split(":");

		if (splitEditParam[0] !== "edit") {
			$location.path("/contribute");
		}

		$http.get(appConfig.apiUrl + "/" + splitEditParam[1]).
			success(function (data) {
				$scope.editUmiData = data;
				$rootScope.title = $scope.editUmiData.title.title;

				$scope.createUmiForm = {
					type: {id: data.umiType, label: data.umiType},
					title: data.title.title,
					titleSynonyms: data.titleSynonyms,
					latexContent: data.latexContent,
					seeAlso: data.seeAlso,
					tags: data.tags
				};
			}).
			error(function () {
				$scope.$parent.notification = {
					"message": "There was an error loading the requested contribution.",
					"type": "error",
					"act": true
				};
				$timeout(function () {
					$scope.$parent.notification.act = false;
				}, 2500);
			});
	}

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
		if ($scope.showSearchResults) {
			$scope.assignUmiId($scope.showSearchResults, false);

			return false;
		}

		var createUmiForm = $scope.createUmiForm;

		// TODO Implement Auth => add additional auth fields, such as token.
		var dispatchCreateUmi = {
			author : $scope.omUser.email,
			message : "Initialise UMI",

			umiType : createUmiForm.type.id,

			title : createUmiForm.title,
			titleSynonyms : createUmiForm.titleSynonyms ? cleanseCommaSeparatedValues(createUmiForm.titleSynonyms) : [],

			content : createUmiForm.latexContent,

			prerequisiteDefinitionIds : $scope.autocompleteData.prerequisiteDefinitions ? _.keys($scope.autocompleteData.prerequisiteDefinitions) : [],
			seeAlsoIds : $scope.autocompleteData.seeAlso ? _.keys($scope.autocompleteData.seeAlso) : [],

			tags : createUmiForm.tags ? cleanseCommaSeparatedValues(createUmiForm.tags) : []
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

		var method = $scope.editUmiData ? ["PUT", "update-latex"] : ["POST", "add"];

		// TODO: Abstract this as a function to make POST requests
		var http = new XMLHttpRequest();
		var url = "http://127.0.0.1:8080/" + method[1]; //appConfig.apiUrl + "/add";
		var data = JSON.stringify(dispatchData);

		http.open(method[0], url, true);

		http.setRequestHeader("Content-type", "application/json;charset=UTF-8");

		http.onreadystatechange = function() {
			if (http.readyState != 4) {
				$scope.$parent.notification = {
					"message": "Your contribution was successfully posted!",
					"type": "success",
					"act": true
				};
				$timeout(function () {
					$scope.$parent.notification.act = false;
				}, 2500);
			} else {
				$scope.$parent.notification = {
					"message": "There was an error ("+ http.status +") making the request. Please check your contribution again before posting",
					"type": "error",
					"act": true
				};
				$timeout(function () {
					$scope.$parent.notification.act = false;
				}, 2500);
			}
		};

		http.send(data);
	};

	// TODO should this be a shared function?
	var cleanseCommaSeparatedValues = function (str) {
		var vals = str.split(",");

		return _.map(vals, function(val) { return val.trim(); });
	};
});