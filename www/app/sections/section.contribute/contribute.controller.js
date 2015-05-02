(function () {
	"use strict";

	angular
		.module("omApp")
		.controller("ContributeController", ContributeController)
		.constant("magicForContribute", {
			pageTitle: "Contribute",
			pageTransparentNav: false,
			parseContentTimeout: 2000,
			parseContentProgressTimeout: 750,
			latexToHtmlRetry: 3
		});

	function ContributeController($scope, $http, omApi, $sce, logger, rx, notification, userLevel, lStorage, mutation, onboarding, magic, magicForContribute) {
		userLevel.check();

		$scope.$parent.title = magicForContribute.pageTitle;
		$scope.$parent.transparentNav = magicForContribute.pageTransparentNav;

		$http.get("app/sections/section.contribute/contribute.magic.json").success(function (data) {
			_.forEach(data, function (val, key) {
				$scope[key] = val;
			});

			formInit();
		}).error(function (errData) {
			logger(errData, "error");
		});

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
			formData.mutationType = "Contribute";

			return mutation.returnStructure(formData, authObject);
		};

		function latexToHtmlPromise() {
			//@TODO change to object
			var wtfHack = $scope.formalVersion ? ["check", returnMutationData()] : ["latex-to-html", $scope.createUmiForm.content];
			return omApi.post(wtfHack[0], wtfHack[1]);
		}

		function createUmiPromise() {
			return omApi.post("add", returnMutationData());
		}

		/**
		 * Makes contribute request
		 */
		$scope.createUmi = function () {
			Rx.Observable
				.fromPromise(createUmiPromise())
				.retry(3)
				.map(function (d) {
					var response = omApi.response(d);
					return response ? response.data : false;
				})
				.where(function (data) {
					logger.log(data, "debug");
					return data;
				})
				.subscribe(function (data) {
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
			.where(function (term) {
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
			.map(function () {
				return Rx.Observable.fromPromise(latexToHtmlPromise())
					.catch(function (e) {
						var err = e.data.error;

						$scope.parsingContent = false;
						$scope.parsedContent = $sce.trustAsHtml("<pre>" + err + "</pre>");
						$scope.parsed = {
							valid: false,
							message: "Error parsing"
						};

						return Rx.Observable.empty();
					})
					.map(function (d) {
						var response = omApi.response(d);

						return response.data;
					});
			})
			.switch()
			.retry(magicForContribute.latexToHtmlRetry)
			.subscribe(function (response) {
				$scope.parsingContent = false;
				$scope.parsedContent = response;
				$scope.parsed = {
					valid: true,
					message: "Parsed"
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

			$scope.parsed = false;

			// NOTE I realise this is a hacky way, but I need to override JS's alphabetical ordering
			$scope.stepsKeys = _.keys($scope.steps);
			$scope.activeStep = 0;
		}

		$scope.$watch("createUmiForm.umiType.formal", function (v) {
			if (!v) {
				$scope.formalVersion = false;
				$scope.metaDefinition = false;
			}
		});
	}

})();