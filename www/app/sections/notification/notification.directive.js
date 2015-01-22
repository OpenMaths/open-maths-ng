(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("notificationLayout", notificationDirective); // @TODO rename to notification-layout everywhere later

	function notificationDirective($timeout, notification) {
		var directive = {
			restrict: "EA",
			templateUrl: "app/sections/section.global/notification.layout.html",
			scope: {},
			replace: true,
			link: linker
		};

		return directive;

		function linker(scope) {
			var notificationDisappearTimeout = 2500;

			notification.subscribe(function (notificationData) {
				scope.notification = notificationData;
				scope.act = true;

				// @TODO clear timeout
				$timeout(function () {
					scope.act = false;
				}, notificationDisappearTimeout);
			});
		}
	}

})();