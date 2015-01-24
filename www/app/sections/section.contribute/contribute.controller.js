(function() {
	"use strict";

	angular
		.module("omApp")
		.controller("ContributeController", ContributeController)
		.constant("magicForContribute", {
			pageTitle: "Contribute",
			pageTransparentNav: false
		});

	function ContributeController($scope, userLevel, magicForContribute) {
		userLevel.check();

		console.log($scope.omUser);

		$scope.$parent.title = magicForContribute.pageTitle;
		$scope.$parent.transparentNav = magicForContribute.pageTransparentNav;
	}

})();