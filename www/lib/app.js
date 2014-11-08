var app = angular.module("openMathsApp", [
		"ngRoute",
	]).config(function($routeProvider, $locationProvider) {

		$routeProvider
			.when("/", {
				templateUrl: "views/home.html",
				controller: "HomeController"
			})
			.when("/ooops", {
				templateUrl: "views/ooops.html",
				controller: "OoopsController"
			})
			.when("/sass", {
				templateUrl: "views/sass.html",
				controller: "SassController"
			})
			.otherwise({
				redirectTo: "/ooops"
			});

			$locationProvider.html5Mode(true);
			$locationProvider.hashPrefix("!");
	});

app.run(function($rootScope) {
	$rootScope.siteName = appConfig.siteName;
	$rootScope.siteLanguage = appConfig.siteLanguage;
	$rootScope.description = appConfig.description;
	$rootScope.keywords = appConfig.keywords;
	$rootScope.author = appConfig.author;
});
