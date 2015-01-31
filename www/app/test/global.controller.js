"use strict";

describe("GlobalController", function () {
	beforeEach(module("omApp"));

	var ctrl, scope, location, magic, constants;

	beforeEach(inject(function ($controller, $rootScope, $location, $window, _magic_, _magicForGlobal_) {
		scope = $rootScope.$new();
		location = $location;
		ctrl = $controller("GlobalController", {$scope: scope});
		magic = _magic_;
		constants = _magicForGlobal_;
	}));

	it("should have the config constant named 'magic' defined", function() {
		expect(magic).toBeDefined();
	});

	it("should have default values and constants predefined.", function () {
		var year = new Date().getFullYear();
		var toBeDefined = [
			scope.title,
			scope.siteName,
			scope.siteLanguage,
			scope.description,
			scope.cssPath,
			scope.uiSettings,
			scope.year
		];

		expect(magic.year).toEqual(year);
		expect(constants.pageDefaultWelcomeLabel).toEqual("dive");
		expect(constants.uiSettingsDefault).toEqual({theme: "light", font: "umi-font-modern"});

		_.map(toBeDefined, function (val) {
			expect(val).toBeDefined()
		});
	});

	it("should set 'path', 'omUser', and 'gapiActive' variables and assign 'dive' to 'path' variable when changing url location", function () {
		location.path("/");
		scope.$apply();

		var toBeDefined = [
			scope.path,
			scope.omUser,
			scope.gapiActive
		];

		_.map(toBeDefined, function (val) {
			expect(val).toBeDefined()
		});

		expect(scope.path).toBe("dive");
	});
});