(function() {
	"use strict";

	angular
		.module("omApp")
		.controller("DiveController", DiveController)
		.constant("magicForDive", {
			pageTitle: "Dive Into",
			pageTransparentNav: true
		});

	function DiveController($scope, $location, notification, magicForDive) {
		$scope.$parent.title = magicForDive.pageTitle;
		$scope.$parent.transparentNav = magicForDive.pageTransparentNav;

		$scope.getUmi = function (uri) {
			if (!uri) {
				notification.generate("No URI argument present",
				"error", $scope);

				return false;
			}

			$location.path("/board/" + uri);
		};
	}

})();