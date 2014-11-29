var mouseDown = false;
var initY;
var lastY;
var row;
var rowInitHeight;
var targetHeight;

$(document).on("mousedown", ".resize-row", function (e) {
	mouseDown = true;
	initY = e.pageY;

	row = $(this).parent();
	rowInitHeight = row.outerHeight();
});

$(document).mouseup(function (e) {
	mouseDown = false;
});

$(document).mousemove(function (e) {
	if (mouseDown == false) return;

	lastY = e.pageY;

	var heightDiff = (lastY - initY);

	targetHeight = rowInitHeight + heightDiff + "px";

	console.log(targetHeight);
	row.attr("style", "min-height:" + targetHeight);
});