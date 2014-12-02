app.directive("menuTop", function() {
	return {
		restrict: "A",
		templateUrl: "views/partials/nav-top.html",
		scope: true,
		transclude : false
	};
});