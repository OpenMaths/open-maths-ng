(function() {
	"use strict";

	angular
		.module("omApp")
		.directive("notification", notification);

	function notification() {
		var directive = {
			restrict: "EA",
			templateUrl: "app/sections/section.global/notification.layout.html",
			scope: true,
			transclude : false // @TODO what is this??
		};

		return directive;
	}

})();