(function() {
	"use strict";

	angular
		.module("omApp")
		.controller("DiveController", DiveController)
		.constant("magicForDive", {
			pageTitle: "Dive Into",
			pageTransparentNav: true
		});

	function DiveController($scope, $location, googleAnalytics, magicForDive) {
		$scope.$parent.title = magicForDive.pageTitle;
		$scope.$parent.transparentNav = magicForDive.pageTransparentNav;

		$scope.$on("$viewContentLoaded", googleAnalytics.sendPageView($location.path()));
	}

})();