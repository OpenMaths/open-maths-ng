app.directive("mathjaxBind", function () {

	return {
		restrict: "A",
		controller: function ($scope, $element, $attrs) {
			$scope.$watch($attrs.mathjaxBind, function (value) {
				$element.text(value == undefined ? "" : value);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
			});
		}
	};

});