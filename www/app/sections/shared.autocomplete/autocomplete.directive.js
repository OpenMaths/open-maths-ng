(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("autocomplete", autocompleteDirective);

	function autocompleteDirective() {
		var directive = {
			restrict: "A",
			templateUrl: "app/sections/shared.autocomplete/layout.html",
			scope: {
				autocompleteData: "=model"
			},
			controller: "SearchController"
		};

		return directive;
	}

})();