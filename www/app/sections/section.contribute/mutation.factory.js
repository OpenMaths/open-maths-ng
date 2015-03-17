// @WRITE A UNIT TEST FOR THIS!

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

	}

})();