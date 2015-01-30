(function () {
	"use strict";

	angular
		.module("omApp")
		.controller("BoardController", BoardController)
		.constant("magicForBoard", {
			pageTitle: "Board",
			pageTransparentNav: false
		});

	function BoardController($scope, magicForBoard) {
		$scope.$parent.title = magicForBoard.pageTitle;
		$scope.$parent.transparentNav = magicForBoard.pageTransparentNav;
	}

})();