(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("rx", rx);

	function rx() {
		var factory = {
			watch: watch
		};

		return factory;

		function watch(scope, watchExpression, objectEquality) {
			return Rx.Observable.create(function (observer) {
				function listener(newValue, oldValue) {
					observer.onNext({oldValue: oldValue, newValue: newValue});
				}

				return scope.$watch(watchExpression, listener, objectEquality);
			});
		}
	}

})();