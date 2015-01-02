app.controller("ContributeController", function ($scope, $rootScope, $http, $location, $timeout, $routeParams) {
	if (!$scope.omUser) {
		alert("You must be logged in to Contribute to OpenMaths!");
		$location.path("/");
	}

	$rootScope.title = "Contribute";

	// The refactoring of this coming soon!!
	$rootScope.navTopTransparentClass = false;

	// This is here on purpose as we alter autocompleteData from a child controller (Search Controller)
	$scope.autocompleteData = {};

	// TODO + UNHACK this shall be a separate page: /edit/uriFriendlyTitle !!
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

	$scope.goToStep = function(key) {
		var keyIndex = _.indexOf($scope.stepsKeys, key);

		if (keyIndex <= $scope.activeStep) {
			$scope.activeStep = keyIndex;
		} else {
			// TODO outsource this as once function? The only thing to consider is the scope -> parent vs no parent?
			$scope.$parent.notification = {"message": "Please complete the current step first before proceeding further.", "type": "info", "act": true};
			$timeout(function () {
				$scope.$parent.notification.act = false;
			}, 2500);
		}
	};

	$scope.steps = {
		"basic-settings": "Basic Settings",
		"editor": "Editor",
		"preview-and-publish": "Preview & Publish"
	};

	// NOTE I realise this is a hacky way, but I need to override JS's alphabetical ordering
	$scope.stepsKeys = _.keys($scope.steps);

	$scope.activeStep = 0;

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
		{id: "Definition", label: "Definition", formal: "allow"},
		{id: "Axiom", label: "Axiom", formal: "allow"},
		{id: "Theorem", label: "Theorem", formal: "allow"},
		{id: "Lemma", label: "Lemma", formal: "allow"},
		{id: "Corollary", label: "Corollary", formal: "allow"},
		{id: "Conjecture", label: "Conjecture", formal: "allow"},
		{id: "Proof", label: "Proof", formal: "allow"},
		{id: "HistoricalNote", label: "Historical Note"},
		{id: "PhilosophicalJustification", label: "Philosophical Justification"},
		{id: "Diagram", label: "Diagram"},
		{id: "Example", label: "Example"},
		{id: "PartialTheorem", label: "Partial Theorem", formal: "allow"}
	];

	$scope.toggleFormalVersion = function() {
		$scope.formalVersion = $scope.formalVersion ? false : true;

		if ($scope.formalVersion) {
			$scope.$parent.notification = {
				"message": "Your contribution is now of type Formal",
				"type": "info",
				"act": true
			};
			$timeout(function () {
				$scope.$parent.notification.act = false;
			}, 2500);
		}
	};

	$scope.createUmi = function() {
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

		$scope.contributeData = dispatchData;
		return false;

		var method = $scope.editUmiData ? ["PUT", "update-latex"] : ["POST", "add"];

		// TODO: Abstract this as a function to make POST requests
		var http = new XMLHttpRequest();
		var url = "http://127.0.0.1:8080/" + method[1]; //appConfig.apiUrl + "/add";
		var data = JSON.stringify(dispatchData);

		http.open(method[0], url, true);

		http.setRequestHeader("Content-type", "application/json;charset=UTF-8");

		http.onreadystatechange = function() {
			if (http.readyState == 4) {
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

	$scope.latexToHtml = function() {
		//$scope.parsedLatexContent = $scope.createUmiForm.latexContent;
		console.log($scope.createUmiForm.latexContent);

			var http = new XMLHttpRequest();
			var url = "http://127.0.0.1:8080/latex-to-html"; //appConfig.apiUrl + "/add";
			var data = $scope.createUmiForm.latexContent;

			http.open("POST", url, true);

			http.setRequestHeader("Content-type", "application/json;charset=UTF-8");

			http.onreadystatechange = function() {
				var parsedLatexContent;

				if (http.readyState == 4) {
					var response = JSON.parse(http.responseText);
					var valid = _.first(_.keys(response)) == "parsed" ? true : false;

					if (!valid) {
						var err = _.first(_.values(response));

						var substrPos = _.parseInt(err[1]) - 4; // does this need < 0 fallback??
						var whereabouts = $scope.createUmiForm.latexContent.substr(substrPos, 8);

						$scope.editorError = {
							message: err[0],
							offset: err[1],
							where: whereabouts
						};

						parsedLatexContent = $scope.createUmiForm.latexContent;
					} else {
						$scope.editorError = false;
						parsedLatexContent = response.parsed;
					}

					var updateParsedLatexContent = function() {
						$scope.parsedLatexContent = parsedLatexContent;
					};

					$scope.$apply(updateParsedLatexContent);
				} else {
					// TODO suss out
					//$scope.$parent.notification = {
					//	"message": "There was an error ("+ http.status +") making the request. Please check your contribution again before posting",
					//	"type": "error",
					//	"act": true
					//};
					//$timeout(function () {
					//	$scope.$parent.notification.act = false;
					//}, 2500);
				}
			};

			http.send(data);
		 // TODO what would the best timeout be?
	};

	// TODO should this be a shared function?
	var cleanseCommaSeparatedValues = function (str) {
		var vals = str.split(",");

		return _.map(vals, function(val) { return val.trim(); });
	};
});