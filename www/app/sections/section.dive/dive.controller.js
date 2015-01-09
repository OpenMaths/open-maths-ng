(function() {
	"use strict";

	angular
		.module("omApp")
		.controller("DiveController", DiveController);

	function DiveController($scope, $location, $log) {
		$scope.$parent.title = "Dive Into";
		$scope.$parent.transparentNav = true;

		// @TODO investigate the behaviour on errors
		$scope.getUmi = function (uri) {
			if (!uri) {
				if (!$scope.searchUmiResults) {
					$log.error("No URI argument present");
					return false;
				}

				$log.error("No URI argument present");
				return false;
			}

			$location.path("/board/" + uri);
		};
	}

})();