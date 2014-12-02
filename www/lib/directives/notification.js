app.directive("notification", function() {
	return {
		restrict: "A",
		templateUrl: "views/partials/notification.html",
		scope: true,
		transclude : false
	};
});