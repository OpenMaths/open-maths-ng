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
	function expandUmiDirective(magicForExpandUmiDirective) {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/shared.umi/expand-umi.layout.html",
			scope: true,
			link: link
		};

		return directive;

		function link(scope, element, attr) {
			scope.label = attr.label;
			scope.directions = magicForExpandUmiDirective.directions;

			console.log("expandUmi directive linker init");
			console.log(scope.data);

			scope.position = function (d) {
				var direction = d;
				console.log("position init'd");
				console.log(scope.grid);
			};
		}

	}

})();