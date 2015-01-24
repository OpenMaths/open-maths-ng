(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("omBind", omBindDirective);

	function omBindDirective($compile) {
		var directive = {
			restrict: "A",
			replace: true,
			link: function (scope, ele, attrs) {
				scope.$watch(attrs.omBind, function (html) {
					ele.html(html);
					$compile(ele.contents())(scope);

					MathJax.Hub.Queue(["Typeset", MathJax.Hub, ele[0]]);
				});
			}
		};

		return directive;
	}

})();