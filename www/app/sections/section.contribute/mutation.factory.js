// @WRITE A UNIT TEST FOR THIS!
// This is a crucial factory, as it returns the data structure needed for the whole app to operate.
// I need to make sure that:
//
// 1. The data it receives in parameters follow the correct structure
// 2. formalVersion and metaDefinition can only be booleans
// 3. Formal and Meta depend on each other, and there are rules which it needs to follow (see contribute.magic.json)

(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("mutation", mutationFactory);

	function mutationFactory() {

		return {
			returnStructure: returnStructure
		};

		function returnStructure(form, auth) {
			var umiForm = form.data,
				typePrefix = form.formalVersion ? "Formal" : "",
				typeSuffix = form.metaDefinition ? "Meta" : "";

			checkData(umiForm);

			return {
				auth: auth,
				message: "Initialise UMI",
				umiType: typePrefix + umiForm.umiType.id + typeSuffix,
				title: _.capitalise(umiForm.title),
				titleSynonyms: umiForm.titleSynonyms ? _.cleanseCSV(umiForm.titleSynonyms) : [],
				content: umiForm.content,
				prerequisiteDefinitionIds: umiForm.prerequisiteDefinitionIds ? _.keys(umiForm.prerequisiteDefinitionIds) : [],
				seeAlsoIds: umiForm.seeAlsoIds ? _.keys(umiForm.seeAlsoIds) : [],
				tags: umiForm.tags ? _.cleanseCSV(umiForm.tags) : []
			};
		}



		// @TODO This whole bit needs proper doing -> should reflect of the above

		//{
		//	umiType: "",
		//	title: "",
		//	titleSynonyms: "",
		//	content: "",
		//	prerequisiteDefinitionIds: {},
		//	seeAlsoIds: {},
		//	tags: ""
		//}

		function checkData(umiForm) {
			var requiredKeys = ["umiType", "title", "titleSynonyms", "content", "prerequisiteDefinitionIds", "seeAlsoIds", "tags"],
				values = _.values(umiForm);

			_.map(requiredKeys, function(k) {
				//console.log(_.includes(values, k));
			});
		}

		function checkFormalMeta() {}

		function checkAuth() {}

	}

})();