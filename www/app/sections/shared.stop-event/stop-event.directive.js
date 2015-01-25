(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("stopEvent", stopEvent);

	function stopEvent() {
		var directive = {
			restrict: "A",
			link: link
		};

		return directive;

		function link(scope, element) {
			element.bind("click", function (e) {
				e.stopPropagation();
			});
		}

	}

})();