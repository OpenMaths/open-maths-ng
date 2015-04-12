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

	function EditController($scope, $http, $sce, $routeParams, logger, rx, notification, userLevel, lStorage, mutation, onboarding, magic, magicForEdit) {
		userLevel.check();

		var param = $routeParams.uriFriendlyTitle;
		logger.log(param, "info");

		$scope.$parent.title = magicForEdit.pageTitle;
		$scope.$parent.transparentNav = magicForEdit.pageTransparentNav;

		$http.get("app/sections/section.edit/edit.magic.json").success(function (data) {
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

		var returnMutationData = function () {
			var formData = {},
				authObject = {accessToken: $scope.omUser.accessToken, gPlusId: $scope.omUser.id};

			formData.data = $scope.createUmiForm;
			formData.formalVersion = $scope.formalVersion;
			formData.metaDefinition = $scope.metaDefinition;
			formData.mutationType = "Edit";

			return mutation.returnStructure(formData, authObject);
		};

		function latexToHtmlPromise() {
			var wtfHack = $scope.formalVersion ? ["check", returnMutationData()] : ["latex-to-html", $scope.createUmiForm.content];
			return $http.post(magic.api + wtfHack[0], wtfHack[1]);
		}

		// @TODO rename everything to update?
		function editUmiPromise() {
			return $http.put(magic.api + "update-latex", returnMutationData());
		}

		/**
		 * Makes contribute request
		 */
		$scope.editUmi = function () {
			Rx.Observable
				.fromPromise(editUmiPromise())
				.retry(3)
				.subscribe(function (d) {
					var data = d.data;

					logger.log(returnMutationData(), "info");
					notification.generate("Your contribution was successfully updated!", "success", data);

					formInit();
				}, function (errorData) {
					notification.generate("There was an error updating your contribution.", "error", errorData);
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
			.debounce(magicForEdit.parseContentTimeout)
			.distinctUntilChanged()
			.do(function () {
				logger.log("LaTeX to HTML translation in progress", "info");

				$scope.parsingContent = true;
				$scope.timeScale = _.timeScale($scope.createUmiForm.content);
			})
			.flatMapLatest(latexToHtmlPromise)
			.retry(magicForEdit.latexToHtmlRetry)
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
			var getUmiPromise = function () {
				return $http.get(magic.api + "title/" + param);
			};

			var getUmiObservable = Rx.Observable.fromPromise(getUmiPromise());

			getUmiObservable.subscribe(function (d) {
					var data = d.data;
					logger.log("UMI title => " + param + " loaded.", "info");

					// @BEWARE CRUFT below
					var prereq = {},
						seeAlso = {};

					_.forEach(data.umi.prerequisiteDefinitions, function (v) {
						prereq[v.id] = v.title;
					});
					_.forEach(data.umi.seeAlso, function (v) {
						seeAlso[v.id] = v.title;
					});

					// @TODO make this MUCH better
					$scope.createUmiForm = {
						umiId: data.umi.id,
						umiType: {
							id: data.umi.umiType,
							label: data.umi.title.umiType
						},
						title: data.umi.title.title,
						titleSynonyms: data.umi.titleSynonyms.join(", "),
						content: data.latexContent,
						prerequisiteDefinitionIds: prereq,
						seeAlsoIds: seeAlso,
						tags: data.umi.tags.join(", ")
					};

					// NOTE I realise this is a hacky way, but I need to override JS's alphabetical ordering
					$scope.stepsKeys = _.keys($scope.steps);
					$scope.activeStep = 0;
				}

				,
				function (errorData) {
					notification.generate("There was an error loading requested contribution.", "error", errorData);
				}
			)
			;
		}
	}

})
();