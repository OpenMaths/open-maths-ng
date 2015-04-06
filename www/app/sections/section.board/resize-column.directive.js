(function () {
	"use strict";

	angular
		.module("omApp")
		.directive("resizeColumn", resizeColumnDirective)
		.constant("magicForResizeColumn", {
			makeResizeSmoother: 9
		});

	function resizeColumnDirective($document, magicForResizeColumn) {
		var directive = {
			restrict: "E",
			link: linker
		};

		return directive;

		function linker(scope, element, attrs) {
			var minWidth = _.parseInt(100 / attrs.columns),
				targetColumnClass = "column-" + attrs.columnIndex,
				targetColumn = document.getElementsByClassName(targetColumnClass),
				currentMinWidth,
				startX = 0,
				x = 0;

			element.on("mousedown", function (event) {
				event.preventDefault();

				currentMinWidth = _.first(targetColumn).style.minWidth ? _.parseInt(_.first(targetColumn).style.minWidth) : minWidth;
				startX = event.pageX;

				$document.on("mousemove", mousemove);
				$document.on("mouseup", mouseup);
			});

			function mousemove(event) {
				x = ((event.pageX - startX) / magicForResizeColumn.makeResizeSmoother);

				if ((currentMinWidth + x) > minWidth) {
					_.forEach(document.getElementsByClassName(targetColumnClass), function(columnBox) {
						columnBox.style.minWidth = (currentMinWidth + x) + "%";
					});
				}
			}

			function mouseup() {
				$document.off("mousemove", mousemove);
				$document.off("mouseup", mouseup);
			}
		}
	}

})();