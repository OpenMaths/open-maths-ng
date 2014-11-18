app.directive("omBind", function ($compile) {

	return {
		restrict: "A",
		replace: true,
		link: function (scope, ele, attrs) {
			scope.$watch(attrs.omBind, function (html) {
				ele.html(html);
				$compile(ele.contents())(scope);

				// This parses LaTeX
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, ele[0]]);
			});
		}
	};

});