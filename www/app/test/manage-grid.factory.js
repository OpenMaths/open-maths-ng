"use strict";

describe("manageGrid", function () {
	beforeEach(module("omApp"));

	var factory, magic;

	beforeEach(inject(function (manageGrid, magicForManageGridFactory) {
		factory = manageGrid;
		magic = magicForManageGridFactory;
	}));

	it("should add a row when requested", function() {
		var newGridSetting = factory.row("add", 3, 3);

		expect(newGridSetting.newRowsNumber).toEqual(4);
		expect(newGridSetting.newRow.length).toEqual(3);
	});

	it("should remove a row when requested", function() {
		var newGridSetting = factory.row("remove", 3, 3);

		expect(newGridSetting.newRowsNumber).toEqual(2);
		expect(newGridSetting.newRow).toBe(false);
	});

	it("should add a column when requested", function() {
		var newGridSetting = factory.column("add", 3);

		expect(newGridSetting.newColumnsNumber).toEqual(4);
		expect(newGridSetting.operation).toEqual("push");
	});

	it("should remove a column when requested", function() {
		var newGridSetting = factory.column("remove", 3);

		expect(newGridSetting.newColumnsNumber).toEqual(2);
		expect(newGridSetting.operation).toEqual("pop");
	});

	it("should not add a row when maximum rows are set", function() {
		var newGridSetting = factory.row("add", magic.gridMaxRows, 3);

		expect(newGridSetting).toBe(false);
	});

	it("should not remove a row when minimum rows are set", function() {
		var newGridSetting = factory.row("remove", magic.gridMinRows, 3);

		expect(newGridSetting).toBe(false);
	});

	it("should not add a column when maximum columns are set", function() {
		var newGridSetting = factory.column("add", magic.gridMaxColumns);

		expect(newGridSetting).toBe(false);
	});

	it("should not remove a column when minimum columns are set", function() {
		var newGridSetting = factory.column("remove", magic.gridMinColumns);

		expect(newGridSetting).toBe(false);
	});
});