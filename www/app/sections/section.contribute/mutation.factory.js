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

	function mutationFactory(logger) {

		return {
			returnStructure: returnStructure
		};

		function returnStructure(form, auth) {
			// @TODO try catch
			//checkDataStructure(form, auth);

			var umiForm = form.data,
				message = form.mutationType == "Contribute" ? "Initialise UMI" : "UMI Mutation",
				typePrefix = form.formalVersion ? "Formal" : "",
				typeSuffix = form.metaDefinition ? "Meta" : "";

			return form.mutationType == "Contribute" ? {
				auth: auth,
				message: message,
				umiType: typePrefix + umiForm.umiType.id + typeSuffix,
				title: _.capitalise(umiForm.title),
				titleSynonyms: umiForm.titleSynonyms ? _.cleanseCSV(umiForm.titleSynonyms) : [],
				content: umiForm.content,
				prerequisiteDefinitionIds: umiForm.prerequisiteDefinitionIds ? _.keys(umiForm.prerequisiteDefinitionIds) : [],
				seeAlsoIds: umiForm.seeAlsoIds ? _.keys(umiForm.seeAlsoIds) : [],
				tags: umiForm.tags ? _.cleanseCSV(umiForm.tags) : []
			} : {
				auth: auth,
				message: message,
				umiId: umiForm.umiId,
				newLatex: umiForm.content
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

		function checkDataStructure(formData, auth) {
			var structures = {
				genericStructure: {
					required: ["data", "formalVersion", "metaDefinition"], // @TODO testing missing data as a first item
					reality: _.keys(formData)
				},
				dataStructure: {
					required: ["umiType", "title", "titleSynonyms", "content", "prerequisiteDefinitionIds", "seeAlsoIds", "tags"],
					reality: _.keys(formData.data)
				},
				authStructure: {
					required: ["accessToken", "gPlusId"],
					reality: _.keys(auth)
				}
			};

			_.forEach(structures, function(data) {
				checkKeys(data.required, data.reality);
			});
		}

		// @TODO abstract into a lodash library?
		function checkKeys(requiredKeys, keys) {
			_.map(requiredKeys, function (k) {
				var contains = _.contains(keys, k);

				if (!contains) {
					logger.log(k + " does not appear in [" + keys + "]", "error");
				}
			});
		}

	}

})();