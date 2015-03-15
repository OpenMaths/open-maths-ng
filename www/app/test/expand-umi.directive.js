//"use strict";
//
//describe("GlobalController", function () {
//	beforeEach(module("omApp"));
//
//	var $scope, constants, element, $compile, $httpBackend;
//
//	$httpBackend.whenGET("app/sections/shared.umi/expand-umi.layout.html").passThrough();
//
//	beforeEach(inject(function ($rootScope, magicForExpandUmiDirective, _$compile_, _$httpBackend_) {
//		$scope = $rootScope.$new();
//		$compile = _$compile_;
//		constants = magicForExpandUmiDirective;
//		element = angular.element('<div expand-umi></div>');
//		$httpBackend = _$httpBackend_;
//
//
//
//
//		$compile(element)($scope);
//		$scope.$digest();
//	}));
//
//	it("should have the constant named 'magicForExpandUmiDirective' well-defined", function () {
//		expect(constants).toBeDefined();
//		expect(constants).toEqual({directions: ["up", "right", "down", "left"]});
//	});
//
//	it("should have default values and constants predefined.", function () {
//		var year = new Date().getFullYear();
//		var toBeDefined = [
//			scope.title,
//			scope.siteName,
//			scope.siteLanguage,
//			scope.description,
//			scope.cssPath,
//			scope.uiSettings,
//			scope.year,
//			scope.onboarding
//		];
//
//		expect(magic.year).toEqual(year);
//		expect(constants.pageDefaultWelcomeLabel).toEqual("dive");
//		expect(constants.uiSettingsDefault).toEqual({
//			theme: "light",
//			font: "umi-font-modern",
//			remember: {boardLayout: true}
//		});
//
//		_.map(toBeDefined, function (val) {
//			expect(val).toBeDefined()
//		});
//
//		expect(_.isObject(scope.onboarding)).toBe(true);
//	});
//
//	it("should set 'path', 'omUser', and 'gapiActive' variables and assign 'dive' to 'path' variable when changing url location", function () {
//		location.path("/");
//		scope.$apply();
//
//		var toBeDefined = [
//			scope.path,
//			scope.omUser,
//			scope.gapiActive
//		];
//
//		_.map(toBeDefined, function (val) {
//			expect(val).toBeDefined()
//		});
//
//		expect(scope.path).toBe("dive");
//	});
//
//	// @TODO test localStorage?
//	it("should set UI Settings and save them to browser localStorage", function () {
//		var valid = ["font", "theme", "Font", "tHEme", "REMEMBER"];
//		var invalid = [" font", "themes", "REmember "];
//
//		_.map(valid, function (val) {
//			scope.setUI(val, "value");
//
//			if (val.toLowerCase() == "remember") {
//				expect(scope.uiSettings[val.toLowerCase()]["value"]).toBe(true);
//			} else {
//				expect(scope.uiSettings[val.toLowerCase()]).toEqual("value");
//			}
//		});
//
//		_.map(invalid, function (val) {
//			var res = scope.setUI(val, "value");
//			expect(res).toBe(false);
//		});
//	});
//
//	function createElement() {
//
//		return element.find('.alert');
//	}
//
//	createElement();
//
//});