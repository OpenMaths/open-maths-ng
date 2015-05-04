// @WRITE A UNIT TEST FOR THIS!
// This is a crucial factory, as it returns the data structure needed for the whole app to operate.
// I need to make sure that:
//
// 1. The data it receives in parameters follow the correct structure
// @DONE 2. formalVersion and metaDefinition can only be booleans
// 3. Formal and Meta depend on each other, and there are rules which it needs to follow (see contribute.magic.json)

(function () {
	"use strict";

	angular
		.module("omApp")
		.factory("mutation", mutationFactory);

	function mutationFactory(logger) {

		return {
			returnStructure: returnStructure
		};

		function returnStructure(form, auth) {
			var umiForm = form.data,
				mutationType = form.mutationType == "Contribute" ? "add" : "update",
				typePrefix = form.formalVersion ? "Formal" : "",
				typeSuffix = form.metaDefinition ? "Meta" : "";

			// @TODO try / catch / log
			checkDataStructure(mutationType, form, auth);

			var object = mutationType == "add" ? {
				auth: auth,
				message: "Initialise UMI",
				umiType: typePrefix + umiForm.umiType.id + typeSuffix,
				title: _.capitalise(umiForm.title),
				titleSynonyms: umiForm.titleSynonyms ? _.cleanseCSV(umiForm.titleSynonyms) : [],
				content: umiForm.content,
				prerequisiteDefinitionIds: umiForm.prerequisiteDefinitionIds ? _.keys(umiForm.prerequisiteDefinitionIds) : [],
				seeAlsoIds: umiForm.seeAlsoIds ? _.keys(umiForm.seeAlsoIds) : [],
				tags: umiForm.tags ? _.cleanseCSV(umiForm.tags) : []
			} : {
				auth: auth,
				message: "UMI Mutation",
				umiId: umiForm.umiId,
				newLatex: umiForm.content
			};

			return object;
		}

		function checkDataStructure(mutationType, formData, auth) {
			var mutationDependentDataStructure = {
				add: ["umiType", "title", "titleSynonyms", "content", "prerequisiteDefinitionIds", "seeAlsoIds", "tags"],
				update: ["umiId", "newLatex"]
			};

			var structures = {
				genericStructure: {
					required: ["data", "formalVersion", "metaDefinition", "mutationType"],
					reality: _.keys(formData)
				},
				dataStructure: {
					required: mutationDependentDataStructure[mutationType],
					reality: _.keys(formData.data)
				},
				authStructure: {
					required: ["accessToken", "gPlusId"],
					reality: _.keys(auth)
				}
			};

			_.forEach(structures, function (data) {
				var a = _.checkKeys(data.required, data.reality);
			});
		}
	}

})();