(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("expandUmi", expandUmiDirective)
		.constant("magicForExpandUmiDirective", {
			directions: ["up", "right", "down", "left"]
		});

	// @TODO Investigate whether it has an impact on performance, when I "transfer" $scope.board
	// via the directive? Shall I only say scope: true?
	// @RESOLVED by assigning an array with target position to the data object
	function expandUmiDirective(magicForExpandUmiDirective) {
		var directive = {
			restrict: "A",
			templateUrl: "app/sections/shared.umi/expand-umi.layout.html",
			scope: {
				position: "=call",
				data: "="
			},
			link: link
		};

		return directive;

		function link(scope, element, attr) {
			scope.expandData = {
				id: attr.id,
				label: attr.label,
				directions: magicForExpandUmiDirective.directions
			};
		}

	}

})();