(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("omNgBind", omNgBindDirective);

	function omNgBindDirective($compile) {
		var directive = {
			restrict: "A",
			link: linker,
			scope: {
				position: "=",
				data: "="
			}
		};

		return directive;

		function linker(scope, ele, attrs) {
			// @TODO possibly simplify? We are getting the data to watch from scope.data
			// Also take a look at omBind
			scope.$watch(attrs.omNgBind, function (html) {
				ele.html(html);
				$compile(ele.contents())(scope);

				MathJax.Hub.Queue(["Typeset", MathJax.Hub, ele[0]]);
			});
		}
	}

})();