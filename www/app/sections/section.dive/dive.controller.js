(function() {
	"use strict";

	angular
		.module("omApp")
		.controller("DiveController", DiveController)
		.constant("magicForDive", {
			pageTitle: "Dive Into",
			pageTransparentNav: true
		});

	function DiveController($scope, magicForDive) {
		$scope.$parent.title = magicForDive.pageTitle;
		$scope.$parent.transparentNav = magicForDive.pageTransparentNav;
	}

})();