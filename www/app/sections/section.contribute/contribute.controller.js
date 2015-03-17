(function () {
	"use strict";

	angular
		.module("omApp")
		.controller("ContributeController", ContributeController)
		.constant("magicForContribute", {
			pageTitle: "Contribute",
			pageTransparentNav: false,
			parseContentTimeout: 2000,
			parseContentProgressTimeout: 750
		});

	function ContributeController($scope, $http, $sce, logger, rx, notification, userLevel, onboarding, magic, magicForContribute) {
		userLevel.check();

		$scope.$parent.title = magicForContribute.pageTitle;
		$scope.$parent.transparentNav = magicForContribute.pageTransparentNav;

		$scope.createUmiForm = {
			umiType: "",
			title: "",
			titleSynonyms: "",
			content: "",
			prerequisiteDefinitionIds: {},
			seeAlsoIds: {},
			tags: ""
		};

		$http.get("app/sections/section.contribute/contribute.magic.json").success(function(data) {
			_.forEach(data, function(val, key) {
				$scope[key] = val;
			});

			// NOTE I realise this is a hacky way, but I need to override JS's alphabetical ordering
			$scope.stepsKeys = _.keys($scope.steps);
			$scope.activeStep = 0;
		}).error(function(errData) {
			logger(errData, "error");
		});

		// @TODO hide when in SESSION storage
		onboarding.generate("contributeAlpha");

		/**
		 * Navigates through individual steps of the contribution
		 *
		 * @param key {int}
		 */
		$scope.goToStep = function (key) {
			var keyIndex = _.indexOf($scope.stepsKeys, key);

			if (keyIndex <= $scope.activeStep) {
				$scope.activeStep = keyIndex;
			} else {
				notification.generate("Please complete the current step first before proceeding further.", "info");
			}
		};

		/**
		 * Toggles Formal Version of a contribution
		 */
		$scope.toggleFormalVersion = function () {
			$scope.formalVersion = $scope.formalVersion ? false : true;

			if ($scope.formalVersion) {
				notification.generate("Your contribution is now of type Formal.", "info");
			} else {
				notification.generate("Your contribution is no longer of type Formal.", "info");
			}
		};

		$scope.toggleMetaDefinition = function () {
			$scope.metaDefinition = $scope.metaDefinition ? false : true;

			if ($scope.metaDefinition) {
				notification.generate("Your contribution is now of type Meta Definition.", "info");
			} else {
				notification.generate("Your contribution is no longer of type Meta Definition.", "info");
			}
		};

		var returnMutationData = function () {
			var createUmiForm = $scope.createUmiForm,
				typePrefix = $scope.formalVersion ? "Formal" : "",
				typeSuffix = $scope.metaDefinition ? "Meta" : "";

			// @TODO should this be a factory?
			return {
				auth: {accessToken: $scope.omUser.accessToken, gPlusId: $scope.omUser.id},
				message: "Initialise UMI",
				umiType: typePrefix + createUmiForm.umiType.id + typeSuffix,
				title: _.capitalise(createUmiForm.title),
				titleSynonyms: createUmiForm.titleSynonyms ? _.cleanseCSV(createUmiForm.titleSynonyms) : [],
				content: createUmiForm.content,
				prerequisiteDefinitionIds: createUmiForm.prerequisiteDefinitionIds ? _.keys(createUmiForm.prerequisiteDefinitionIds) : [],
				seeAlsoIds: createUmiForm.seeAlsoIds ? _.keys(createUmiForm.seeAlsoIds) : [],
				tags: createUmiForm.tags ? _.cleanseCSV(createUmiForm.tags) : []
			};
		};

		function latexToHtmlPromise() {
			var wtfHack = $scope.formalVersion ? ["check", returnMutationData()] : ["latex-to-html", $scope.createUmiForm.content];
			return $http.post(magic.api + wtfHack[0], wtfHack[1]);
		}

		function createUmiPromise() {
			console.log(returnMutationData());
			return $http.post(magic.api + "add", returnMutationData());
		}

		/**
		 * Makes mutation request
		 */
		$scope.createUmi = function () {
			var createUmiObservable = Rx.Observable.fromPromise(createUmiPromise());

			createUmiObservable.subscribe(function(d) {
				var data = d.data;

				logger.log(returnMutationData(), "info");
				notification.generate("Your contribution was successfully posted!", "success", data);
			}, function(errorData) {
				notification.generate("There was an error posting your contribution.", "error", errorData);
			});
		};

		var latexToHtmlObservable = rx.watch($scope, "createUmiForm.content")
			.map(function (e) {
				return e.newValue;
			})
			.filter(function (term) {
				$scope.parsedContent = term;
				return term;
			})
			.debounce(2500) // @TODO magicVars
			.distinctUntilChanged()
			.do(function () {
				logger.log("LaTeX to HTML translation in progress", "info");

				$scope.parsingContent = true;
				$scope.timeScale = _.timeScale($scope.createUmiForm.content);
			})
			.flatMapLatest(latexToHtmlPromise)
			.retry(3); // @TODO magicVars

		latexToHtmlObservable.subscribe(function (d) {
				$scope.parsingContent = false;

				var response = d.data,
					parsedContent,
					valid = _.first(response) == "s" ? true : false;

				// @TODO remove after testing
				logger.log(response, "info");
				logger.log(valid, "info");

				if (!valid) {
					var errMessage = response.substring(1);
					logger.log(errMessage, "error");

					parsedContent = $sce.trustAsHtml("<pre>" + errMessage + "</pre>");
				} else {
					parsedContent = response.substring(1);
				}

				$scope.parsedContent = parsedContent;
				$scope.parsed = {
					valid: valid,
					message: valid ? "You are the man!" : "Error parsing, check stack trace"
				};
			},
			function (errorData) {
				$scope.parsingContent = false;
				$scope.parsedContent = $sce.trustAsHtml("<pre>There was an error parsing contribution: " + errorData + "</pre>");

				$scope.parsed = {
					valid: false,
					message: "Error parsing."
				};

				notification.generate("There was an error parsing content", "error", errorData);
			});
	}

})();