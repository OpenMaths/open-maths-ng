(function () {
	"use strict";

	angular
		.module("omApp")
		.controller("EditController", EditController)
		.constant("magicForEdit", {
			pageTitle: "Edit",
			pageTransparentNav: false,
			parseContentTimeout: 2000,
			parseContentProgressTimeout: 750,
			latexToHtmlRetry: 3
		});

	function EditController($scope, $http, $sce, logger, rx, notification, userLevel, lStorage, mutation, onboarding, magic, magicForContribute) {
		userLevel.check();

		$scope.$parent.title = magicForContribute.pageTitle;
		$scope.$parent.transparentNav = magicForContribute.pageTransparentNav;

		//$http.get("app/sections/section.contribute/contribute.magic.json").success(function (data) {
		//	_.forEach(data, function (val, key) {
		//		$scope[key] = val;
		//	});
		//
		//	formInit();
		//}).error(function (errData) {
		//	logger(errData, "error");
		//});

		formInit();

		lStorage.get("onboarding").contributeAlpha ? "" : onboarding.generate("contributeAlpha");

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
			var formData = {},
				authObject = {accessToken: $scope.omUser.accessToken, gPlusId: $scope.omUser.id};

			formData.data = $scope.createUmiForm;
			formData.formalVersion = $scope.formalVersion;
			formData.metaDefinition = $scope.metaDefinition;

			return mutation.returnStructure(formData, authObject);
		};

		function latexToHtmlPromise() {
			var wtfHack = $scope.formalVersion ? ["check", returnMutationData()] : ["latex-to-html", $scope.createUmiForm.content];
			return $http.post(magic.api + wtfHack[0], wtfHack[1]);
		}

		function createUmiPromise() {
			return $http.post(magic.api + "add", returnMutationData());
		}

		/**
		 * Makes contribute request
		 */
		$scope.createUmi = function () {
			Rx.Observable
				.fromPromise(createUmiPromise())
				.retry(3)
				.subscribe(function (d) {
					var data = d.data;

					logger.log(returnMutationData(), "info");
					notification.generate("Your contribution was successfully posted!", "success", data);

					formInit();
				}, function (errorData) {
					notification.generate("There was an error posting your contribution.", "error", errorData);
				});
		};

		rx.watch($scope, "createUmiForm.content")
			.map(function (e) {
				return e.newValue;
			})
			.filter(function (term) {
				$scope.parsedContent = term;
				return term;
			})
			.debounce(magicForContribute.parseContentTimeout)
			.distinctUntilChanged()
			.do(function () {
				logger.log("LaTeX to HTML translation in progress", "info");

				$scope.parsingContent = true;
				$scope.timeScale = _.timeScale($scope.createUmiForm.content);
			})
			.flatMapLatest(latexToHtmlPromise)
			.retry(magicForContribute.latexToHtmlRetry)
			.subscribe(function (d) {
				$scope.parsingContent = false;

				var response = d.data,
					parsedContent,
					valid = _.first(response) == "s" ? true : false;

				logger.log({response: response, valid: valid}, "info");

				if (!valid) {
					var errMessage = response.substring(1);

					parsedContent = $sce.trustAsHtml("<pre>" + errMessage + "</pre>");
				} else {
					parsedContent = response.substring(1);
				}

				$scope.parsedContent = parsedContent;
				$scope.parsed = {
					valid: valid,
					message: valid ? "Parsed" : "Something went wrong"
				};
			}, function (errorData) {
				$scope.parsingContent = false;
				$scope.parsedContent = $sce.trustAsHtml("<pre>There was an error parsing contribution, try refreshing the page and contributing again.</pre>");

				$scope.parsed = {
					valid: false,
					message: "Error parsing"
				};

				notification.generate("There was an error parsing content", "error", errorData);
			});

		function formInit() {
			$scope.createUmiForm = {
				umiType: "",
				title: "",
				titleSynonyms: "",
				content: "",
				prerequisiteDefinitionIds: {},
				seeAlsoIds: {},
				tags: ""
			};

			// NOTE I realise this is a hacky way, but I need to override JS's alphabetical ordering
			$scope.stepsKeys = _.keys($scope.steps);
			$scope.activeStep = 0;
		}

		$scope.$watch("createUmiForm.umiType.formal", function(v) {
			if (!v) {
				$scope.formalVersion = false;
				$scope.metaDefinition = false;
			}
		});
	}

})();