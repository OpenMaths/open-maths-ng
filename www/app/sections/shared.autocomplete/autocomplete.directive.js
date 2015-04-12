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
			controller: "SearchController",
			link: linker
		};

		return directive;

		function linker(scope, element, attrs) {
			scope.placeholder = attrs.placeholder;
		}
	}

})();