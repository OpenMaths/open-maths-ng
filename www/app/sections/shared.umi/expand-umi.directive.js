(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("expandUmi", expandUmiDirective)
		.constant("magicForExpandUmiDirective", {
			directions: ["up", "right", "down", "left"]
		});

	// @TODO Investigate whether it has an impact on performance, when I "transfer" $scope.board
	// via the directive?
	function expandUmiDirective(magicForExpandUmiDirective) {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/shared.umi/expand-umi.layout.html",
			scope: {
				id: "=",
				board: "="
			},
			link: link
		};

		return directive;

		function link(scope) {
			scope.directions = magicForExpandUmiDirective.directions;

			console.log("expandUmi directive linker init");
			console.log(scope.id);

			scope.position = function () {
				console.log("position init'd");
			};
		}

	}

})();