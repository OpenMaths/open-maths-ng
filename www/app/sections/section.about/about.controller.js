(function () {
	"use strict";

	angular
		.module("omApp")
		.controller("AboutController", AboutController)
		.constant("magicForAbout", {
			pageTitle: "About",
			pageTransparentNav: true
		});

	function AboutController($scope, magicForAbout) {
		$scope.$parent.title = magicForAbout.pageTitle;
		$scope.$parent.transparentNav = magicForAbout.pageTransparentNav;

		$scope.$parent.customerFacingPage = true;
	}

})();