(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("notificationLayout", notificationDirective)
		.constant("magicForNotificationDirective", {
			notificationDisappearTimeout: 2500
		});

	function notificationDirective($timeout, notification, magicForNotificationDirective) {
		var directive = {
			restrict: "E",
			templateUrl: "app/sections/shared.notification/layout.html",
			scope: {},
			replace: true,
			link: linker
		};

		return directive;

		function linker(scope) {
			notification.subscribe(function (notificationData) {
				scope.notification = notificationData;
				scope.act = true;

				$timeout(function () {
					scope.act = false;
				}, magicForNotificationDirective.notificationDisappearTimeout);
			});
		}
	}

})();