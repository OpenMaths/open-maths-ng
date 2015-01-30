(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("contributeLayout", contributeDirective)
		.constant("magicForContributeDirective", {
			parseLatexContentTimeout: 2000,
			parseLatexContentProgressTimeout: 750,
			steps: {
				"basic-settings": "Basic Settings",
				"editor": "Editor",
				"preview-and-publish": "Preview & Publish"
			},
			formErrorMessages: {
				required: "This field is required.",
				maxLength: "This field is exceeding the maximum length of 128 characters.",
				umiTitle: "The title should only consist of letters, spaces, or hyphens"
			},
			formInstructions: {
				type: "What category of information?",
				title: "Users will be able to search your contribution.",
				titleSynonyms: "Comma-separated list of alternative names.",
				latexContent: "The actual content. You are free to use LaTeX (including text-mode macros!!).",
				prerequisiteDefinitions: "Comma-separated list of valid dependency Titles.",
				seeAlso: "Comma-separated list of valid Titles which may be related.",
				tags: "Comma-separated list of tags to help users find your contribution.",
				dispatch: "Submitting your contribution will create a request to pull the content into our database."
			},
			formUmiTypes: [
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
			]
		});

	function contributeDirective($http, $window, $timeout, magic, notification, magicForContributeDirective) {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/section.contribute/contribute.layout.html",
			scope: true,
			link: linker
		};

		return directive;

		// @TODO yes, yes, this should be a controller
		function linker(scope) {
			// @NOTE This is to store the $timeout promise,
			// so it can be reset on every keystroke.
			var parseLatexContent;

			// @NOTE This is here on purpose as we alter autocompleteData from a child controller (Search Controller)
			scope.autocompleteData = {};

			scope.formErrorMessages = magicForContributeDirective.formErrorMessages; // CHANGE IN LAYOUT
			scope.formInstructions = magicForContributeDirective.formInstructions; // CHANGE IN LAYOUT
			scope.formUmiTypes = magicForContributeDirective.formUmiTypes; // CHANGE IN LAYOUT

			// NOTE I realise this is a hacky way, but I need to override JS's alphabetical ordering
			scope.steps = magicForContributeDirective.steps;
			scope.stepsKeys = _.keys(scope.steps);
			scope.activeStep = 0;

			/**
			 * Navigates through individual steps of the contribution
			 *
			 * @param key {int}
			 */
			scope.goToStep = function (key) {
				var keyIndex = _.indexOf(scope.stepsKeys, key);

				if (keyIndex <= scope.activeStep) {
					scope.activeStep = keyIndex;
				} else {
					notification.generate("Please complete the current step first before proceeding further.", "info");
				}
			};

			/**
			 * Toggles Formal Version of a contribution
			 */
			scope.toggleFormalVersion = function () {
				scope.formalVersion = scope.formalVersion ? false : true;

				if (scope.formalVersion) {
					notification.generate("Your contribution is now of type Formal.", "info");
				} else {
					notification.generate("Your contribution is no longer of type Formal.", "info");
				}
			};

			/**
			 * Makes mutation request
			 */
			scope.createUmi = function () {
				var createUmiForm = scope.createUmiForm;

				var dispatchCreateUmi = {
					auth: {
						accessToken: scope.omUser.accessToken,
						gPlusId: scope.omUser.id
					},

					message: "Initialise UMI",

					umiType: createUmiForm.type.id,

					title: _.capitalise(createUmiForm.title),
					titleSynonyms: createUmiForm.titleSynonyms ? _.cleanseCSV(createUmiForm.titleSynonyms) : [],

					content: createUmiForm.latexContent,

					prerequisiteDefinitionIds: scope.autocompleteData.prerequisiteDefinitions ? _.keys(scope.autocompleteData.prerequisiteDefinitions) : [],
					seeAlsoIds: scope.autocompleteData.seeAlso ? _.keys(scope.autocompleteData.seeAlso) : [],

					tags: createUmiForm.tags ? _.cleanseCSV(createUmiForm.tags) : []
				};

				scope.contributeData = dispatchCreateUmi;

				$http.post(magic.api + "add", dispatchCreateUmi).
					success(function (data) {
						notification.generate("Your contribution was successfully posted!", "success", data);
					}).
					error(function (errorData, status) {
						notification.generate("There was an error posting your contribution.", "error", errorData);
					});
			};

			/**
			 * Updates latex to HTML
			 *
			 * @returns {boolean}
			 */
			scope.latexToHtml = function () {
				if (!scope.createUmiForm.latexContent) {
					scope.parsedLatexContent = "";

					return false;
				}

				$timeout.cancel(parseLatexContent);

				scope.parsedLatexContent = scope.createUmiForm.latexContent;

				parseLatexContent = $timeout(function() {}, magicForContributeDirective.parseLatexContentTimeout);

				parseLatexContent.then(function () {
					console.log(scope.createUmiForm.latexContent);

					scope.parsingContent = true;

					scope.timeScale = _.timeScale(scope.createUmiForm.latexContent);

					$http.post(magic.api + "latex-to-html", scope.createUmiForm.latexContent).
						success(function (response) {
							var parsedLatexContent;
							var valid = _.first(_.keys(response)) == "parsed" ? true : false;

							if (!valid) {
								var err = _.first(_.values(response));

								var substrPos = _.parseInt(err[1]) - 4; // does this need < 0 fallback??
								var whereabouts = scope.createUmiForm.latexContent.substr(substrPos, 8);

								// TODO consider changing to Object rather than an array (BackEnd tidying)
								scope.editorError = {
									message: err[0],
									offset: err[1],
									where: whereabouts
								};

								parsedLatexContent = scope.createUmiForm.latexContent;
							} else {
								scope.editorError = false;
								parsedLatexContent = response.parsed;
							}

							scope.parsedLatexContent = parsedLatexContent;

							// @NOTE This timeout is to replicate the actual parsing in production (may take about 1 sec.)
							$timeout(function () {
								scope.parsingContent = false;
							}, magicForContributeDirective.parseLatexContentProgressTimeout);
						}).
						error(function (errorData) {
							notification.generate("There was an error parsing content", "error", errorData);
						});
				});
			};
		}
	}

})();