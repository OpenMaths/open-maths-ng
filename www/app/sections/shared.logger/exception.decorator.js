(function () {
	"use strict";

	angular
		.module("omApp")
		.config(decorateException);

	function decorateException($provide) {
		$provide.decorator("$exceptionHandler", function($delegate) {
			return function(exception, cause) {
				$delegate(exception, cause);
				alert(exception.message);
			};
		});
	}

})();