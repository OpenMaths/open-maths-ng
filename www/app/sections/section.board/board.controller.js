(function () {
	"use strict";

	angular
		.module("omApp")
		.controller("BoardController", BoardController)
		.constant("magicForBoard", {
			pageTitle: "Board",
			pageTransparentNav: false
		});

	function BoardController($scope, $location, googleAnalytics, magicForBoard) {
		$scope.$parent.title = magicForBoard.pageTitle;
		$scope.$parent.transparentNav = magicForBoard.pageTransparentNav;

		$scope.$on("$viewContentLoaded", googleAnalytics.sendPageView($location.path()));
	}

})();