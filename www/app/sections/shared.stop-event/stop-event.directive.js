(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("stopEvent", stopEvent);

	function stopEvent() {
		var directive = {
			restrict: "A",
			link: function (scope, element) {
				element.bind("click", function (e) {
					e.stopPropagation();
				});
			}
		};

		return directive;
	}

})();