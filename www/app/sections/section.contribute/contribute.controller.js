(function() {
	"use strict";

	angular
		.module("omApp")
		.controller("ContributeController", ContributeController)
		.constant("magicForContribute", {
			pageTitle: "Contribute",
			pageTransparentNav: false,
			parseLatexContentTimeout: 2000,
			parseLatexContentProgressTimeout: 800
		});

	function ContributeController($scope, $location, $timeout, magic, notification) {
		// @TODO document
		var parseLatexContent;

		$scope.$parent.title = magicForContribute.pageTitle;
		$scope.$parent.transparentNav = magicForContribute.pageTransparentNav;

		// @TODO abstract
		if (!$scope.omUser) {
			alert("You must be logged in to Contribute to OpenMaths!");
			$location.path("/");
		}

		// NOTE This is here on purpose as we alter autocompleteData from a child controller (Search Controller)
		$scope.autocompleteData = {};

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

		/**
		 * Navigates through individual steps of the contribution
		 *
		 * @param key {int}
		 */
		$scope.goToStep = function(key) {
			var keyIndex = _.indexOf($scope.stepsKeys, key);

			if (keyIndex <= $scope.activeStep) {
				$scope.activeStep = keyIndex;
			} else {
				notification.generate(
					"Please complete the current step first before proceeding further.",
					"info", $scope.$parent
				);
			}
		};

		/**
		 * Toggles Formal Version of a contribution
		 */
		$scope.toggleFormalVersion = function() {
			$scope.formalVersion = $scope.formalVersion ? false : true;

			if ($scope.formalVersion) {
				notification.generate(
					"Your contribution is now of type Formal.",
					"info", $scope.$parent
				);
			} else {
				notification.generate(
					"Your contribution is no longer of type Formal.",
					"info", $scope.$parent
				);
			}
		};

		/**
		 * Makes mutation request (either a new Contribution or an Edit)
		 */
		$scope.createUmi = function() {
			var createUmiForm = $scope.createUmiForm;

			var dispatchCreateUmi = {
				auth: {
					accessToken: $scope.omUser.accessToken,
					gPlusId: $scope.omUser.id
				},

				message : "Initialise UMI",

				umiType : createUmiForm.type.id,

				title : _.capitalise(createUmiForm.title),
				titleSynonyms : createUmiForm.titleSynonyms ? _.cleanseCSV(createUmiForm.titleSynonyms) : [],

				content : createUmiForm.latexContent,

				prerequisiteDefinitionIds : $scope.autocompleteData.prerequisiteDefinitions ? _.keys($scope.autocompleteData.prerequisiteDefinitions) : [],
				seeAlsoIds : $scope.autocompleteData.seeAlso ? _.keys($scope.autocompleteData.seeAlso) : [],

				tags : createUmiForm.tags ? _.cleanseCSV(createUmiForm.tags) : []
			};

			$scope.contributeData = dispatchCreateUmi;

			// TODO requestData 0 and 1 indexes should be keys??
			CORS.request("POST", "add", JSON.stringify(dispatchCreateUmi), function() {
				notification.generate(
					"Your contribution was successfully posted!",
					"success", $scope.$parent, true
				);
			}, false, {"Content-type" : "application/json;charset=UTF-8"});
		};

		/**
		 * Updates latex to HTML
		 *
		 * @returns {boolean}
		 */
		$scope.latexToHtml = function() {
			if (!$scope.createUmiForm.latexContent) {
				$scope.parsedLatexContent = "";

				return false;
			}

			window.clearTimeout(parseLatexContent);

			$scope.parsedLatexContent = $scope.createUmiForm.latexContent;

			// NOTE this needs to be _.delay, not $timeout
			parseLatexContent = _.delay(function() {
				$scope.parsingContent = true;

				$scope.timeScale = _.timeScale($scope.createUmiForm.latexContent);

				CORS.request("POST", "latex-to-html", $scope.createUmiForm.latexContent, function(response) {
					var parsedLatexContent;
					var response = JSON.parse(response);
					var valid = _.first(_.keys(response)) == "parsed" ? true : false;

					if (!valid) {
						var err = _.first(_.values(response));

						var substrPos = _.parseInt(err[1]) - 4; // does this need < 0 fallback??
						var whereabouts = $scope.createUmiForm.latexContent.substr(substrPos, 8);

						// TODO consider changing to Object rather than an array (BackEnd tidying)
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

					$scope.$apply(function() {
						$scope.parsedLatexContent = parsedLatexContent;
					});

					// NOTE This timeout is to replicate the actual parsing in production (may take about 1 sec.)
					$timeout(function() {
						$scope.parsingContent = false;
					}, magicForContribute.parseLatexContentProgressTimeout);
				}, false, {"Content-type" : "application/json;charset=UTF-8"});
			}, magicForContribute.parseLatexContentTimeout);
		};
	}

})();