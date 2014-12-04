app.controller("ContributeController", function ($scope, $rootScope, $http, $location, $timeout) {
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

		// TODO: Abstract this as a function to make POST requests
		// TODO: Look into JSONP
		var http = new XMLHttpRequest();
		var url = "http://127.0.0.1:8080/add"; //appConfig.apiUrl + "/add";
		var data = JSON.stringify(dispatchCreateUmi);

		http.open("POST", url, true);

		http.setRequestHeader("Content-type", "application/json;charset=UTF-8");
		//http.setRequestHeader("Accept", "application/json;charset=UTF-8");

		http.onload = function() {
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
});