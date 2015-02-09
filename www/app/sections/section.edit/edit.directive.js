(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("editLayout", editDirective);

	function editDirective() {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/section.edit/edit.layout.html"
		};

		return directive;
	}

})();