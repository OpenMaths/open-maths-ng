(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("resizeRow", resizeRowDirective);

	function resizeRowDirective($document) {
		var directive = {
			restrict: "E",
			link: linker
		};

		return directive;

		function linker(scope, element, attrs) {
			var minHeight = _.parseInt(attrs.minHeight);
			var targetRow = "row-" + attrs.rowIndex;

			var currentMinHeight, startY = 0, y = 0;

			element.on("mousedown", function (event) {
				event.preventDefault();

				currentMinHeight = document.getElementById(targetRow).style.minHeight ? _.parseInt(document.getElementById(targetRow).style.minHeight) : minHeight;
				startY = event.pageY;

				$document.on("mousemove", mousemove);
				$document.on("mouseup", mouseup);
			});

			function mousemove(event) {
				y = event.pageY - startY;

				if ((currentMinHeight + y) > minHeight) {
					document.getElementById(targetRow).style.minHeight = (currentMinHeight + y) + "px";
				}
			}

			function mouseup() {
				$document.off("mousemove", mousemove);
				$document.off("mouseup", mouseup);
			}
		}
	}

})();