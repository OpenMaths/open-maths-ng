"use strict";

describe("ContributeController", function () {
	beforeEach(module("omApp"));

	var ctrl, scope;

	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		ctrl = $controller("ContributeController", {$scope: scope});
	}));

	it("should have a title assigned.", function () {
		expect(scope.title).toBeDefined();
	});
});