(function() {
	"use strict";

	angular
		.module("omApp")
		.controller("ContributeController", ContributeController)
		.constant("magicForContribute", {
			pageTitle: "Contribute",
			pageTransparentNav: false
		});

	function ContributeController($scope, $location, magicForContribute) {
		// @TODO abstract
		if (!$scope.omUser) {
			alert("You must be logged in to Contribute to OpenMaths!");
			//$location.path("/"); TEMPORARILY OUT
		}

		$scope.$parent.title = magicForContribute.pageTitle;
		$scope.$parent.transparentNav = magicForContribute.pageTransparentNav;
	}

})();