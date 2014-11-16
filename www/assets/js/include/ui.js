// HENRIK SWARTZ

var templates = {};

templates.umi = function(id, umiInitClasses) {
	return '<div class="umi ' + umiInitClasses + '">' +
	'<div class="content-holder">' +
	'<div class="title">' +
	'<label class="proof">CATEGORY</label>' +
	'<strong>TITLE (temporary id reference: ' + id + ')</strong>' +
	'</div>' +
	'<article>' +
	'<div class="content"><p>States that the square of the <strong data-id="3"><i class="expand expand-down"></i><i class="expand expand-up"></i><i class="expand expand-left"></i><i class="expand expand-right"></i>Another ID</strong> is equal to the sum of the <strong data-id="3"><i class="expand expand-down"></i><i class="expand expand-up"></i><i class="expand expand-left"></i><i class="expand expand-right"></i>square</strong> of the other two sides.</p><em>$a^2 + b^2 = c^2$</em></div>' +
	'</article>' +
	'</div>' +
	'<div class="footer"><strong>See also:</strong> SEE ALSO</div>' +
	'</div>';
};

// This enables users to switch themes.
$(document).on("click", "#theme-switch", function () {
	$("body").toggleClass("dark");
});

$(document).on("click", ".expand", function () {
	var parent = $(this).parent();

	var expandId = parent.attr("data-id");

	parent.addClass("inactive").find(".expand").hide();

	var rowParent = $(this).closest(".row");
	var columnParent = $(this).closest(".column");
	var umiParent = $(this).closest(".umi");

	var targetClass = [];

	var currentPosition = [
		parseInt(rowParent.attr("data-row")),
		parseInt(columnParent.attr("data-column"))
	];

	if ($(this).hasClass("expand-up")) {

		umiParent.addClass("opens-top");

		var targetPosition = [
			currentPosition[0] - 1,
			currentPosition[1]
		];
		targetClass.push("opens-bottom");

	} else if ($(this).hasClass("expand-down")) {

		umiParent.addClass("opens-bottom");

		var targetPosition = [
			currentPosition[0] + 1,
			currentPosition[1]
		];
		targetClass.push("opens-top");

	} else if ($(this).hasClass("expand-left")) {

		umiParent.addClass("opens-left");

		var targetPosition = [
			currentPosition[0],
			currentPosition[1] - 1
		];
		targetClass.push("opens-right");

	} else if ($(this).hasClass("expand-right")) {

		umiParent.addClass("opens-right");

		var targetPosition = [
			currentPosition[0],
			currentPosition[1] + 1
		];
		targetClass.push("opens-left");

	}

	if (targetPosition[0] == 1) {
		targetClass.push("closes-top");
	} if (targetPosition[0] == 3) {
		targetClass.push("closes-bottom");
	} if (targetPosition[1] == 1) {
		targetClass.push("closes-left");
	} if (targetPosition[1] == 3) {
		targetClass.push("closes-right");
	}

	var targetClasses = targetClass.join(" ");

	$(".row[data-row=" + targetPosition[0] + "] .column[data-column=" + targetPosition[1] + "]")
		.html(templates.umi(expandId, targetClasses));

});