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

	it("should have the config constant named 'magic' defined", function () {
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
			scope.year,
			scope.onboarding
		];

		expect(magic.year).toEqual(year);
		expect(constants.pageDefaultWelcomeLabel).toEqual("dive");
		expect(constants.gapiArtificialTimeout).toEqual(100);
		expect(constants.uiSettingsDefault).toEqual({
			theme: "light",
			font: "umi-font-modern",
			remember: {boardLayout: true}
		});

		_.map(toBeDefined, function (val) {
			expect(val).toBeDefined()
		});

		expect(_.isObject(scope.onboarding)).toBe(true);
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

	// @TODO test localStorage?
	it("should set UI Settings and save them to browser localStorage", function () {
		var valid = ["font", "theme", "Font", "tHEme", "REMEMBER"];
		var invalid = [" font", "themes", "REmember "];

		_.map(valid, function (val) {
			scope.setUI(val, "board");

			if (val.toLowerCase() == "remember") {
				expect(scope.uiSettings[val.toLowerCase()]["board"]).toBe(true);
			} else {
				expect(scope.uiSettings[val.toLowerCase()]).toEqual("board");
			}
		});

		_.map(invalid, function (val) {
			var res = scope.setUI(val, "board");
			expect(res).toBe(false);
		});
	});
});