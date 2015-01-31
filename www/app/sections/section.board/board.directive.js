(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("boardLayout", boardDirective);

	function boardDirective() {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/section.board/board.layout.html",
		};

		return directive;
	}

})();