"use strict";

describe("mutationFactory", function () {
	beforeEach(module("omApp"));

	var factory,
		formData = {
			data: {
				umiType: {},
				title: "Title",
				titleSynonyms: "title",
				content: "This is content for title",
				prerequisiteDefinitionIds: [1,2],
				seeAlsoIds: [2],
				tags: "tag 1, tag 2 ,  tag 3"
			},
			formalVersion: true,
			metaDefinition: true
		},
		authObject = {
			accessToken: "testToken",
			gPlusId: "testId"
		};

	beforeEach(inject(function (mutation) {
		factory = mutation;
	}));



	it("should throw an exception when not having relevant data", function () {
		factory.returnStructure(formData, authObject);
	});
});