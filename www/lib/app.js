var app = angular.module("openMathsApp", [
	"ngRoute",
	"angular-loading-bar",
	"ngSanitize"
]).config(function ($routeProvider, $locationProvider) {

	$routeProvider
		.when("/", {
			templateUrl: "views/home.html",
			controller: "HomeController"
		})
		.when("/editor", {
			templateUrl: "views/editor.html",
			controller: "EditorController"
		})
		.when("/board", {
			templateUrl: "views/board.html",
			controller: "BoardController"
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

}).config(["cfpLoadingBarProvider", function (cfpLoadingBarProvider) {
	cfpLoadingBarProvider.includeSpinner = false;
}]);

app.run(function ($rootScope) {
	$rootScope.siteName = appConfig.siteName;
	$rootScope.siteLanguage = appConfig.siteLanguage;
	$rootScope.description = appConfig.description[appConfig.siteLanguage];
});
