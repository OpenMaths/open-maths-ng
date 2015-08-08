module openmaths {
    'use strict';

    //export enum UMIType {
    //    Definition, Axiom, AxiomScheme,
    //    Notation, Theorem, Lemma,
    //    Corollary, Conjecture, Proof,
    //    HistoricalNote, PhilosophicalJustification,
    //    Diagram, Example, Special, PartialTheorem
    //}

    export interface IMutationFormObject {
        active: boolean;
        description: string;
        label: string;
        update?: Function;
        parseCsv?: Function;
        value: any;
    }

    export enum UpdateValues {PrerequisiteDefinitions, SeeAlso}

    export class MutationForm {
        content: IMutationFormObject;
        prerequisiteDefinitionIds: IMutationFormObject;
        seeAlsoIds: IMutationFormObject;
        tags: IMutationFormObject;
        title: IMutationFormObject;
        titleSynonyms: IMutationFormObject;
        umiType: IMutationFormObject;

        constructor() {
            this.content = {
                active: false,
                description: 'The actual content. You are free to use LaTeX (including text-mode macros!!)',
                label: 'Content',
                value: 'C\'mon! Write some LaTeX to see me work! :-)'
            };

            this.prerequisiteDefinitionIds = {
                active: false,
                description: 'Comma-separated list of valid dependency Titles',
                label: 'Prerequisite Definitions',
                update: (resolveObject: ISearchResult) => this.updateValues(UpdateValues.PrerequisiteDefinitions, resolveObject),
                value: {}
            };

            this.seeAlsoIds = {
                active: false,
                description: 'Comma-separated list of valid Titles which may be related',
                label: 'See Also',
                update: (resolveObject: ISearchResult) => this.updateValues(UpdateValues.SeeAlso, resolveObject),
                value: {}
            };

            this.tags = {
                active: false,
                description: 'Comma-separated list of tags to help users find your contribution.',
                label: 'Tags',
                parseCsv: (data) => this.tags.value = openmaths.CsvParser.parse(data),
                value: ''
            };

            this.title = {
                active: true,
                description: 'Users will be able to search your contribution',
                label: 'Contribution Title',
                value: ''
            };

            // Possibly redundant?
            this.titleSynonyms = {
                active: false,
                description: 'Comma-separated list of alternative names.',
                label: 'Title Synonyms',
                value: ''
            };

            this.umiType = {
                active: false,
                description: 'What category of information?',
                label: 'Contribution Category',
                value: ''
            };
        }

        resetActive(): void {
            _.forEach(this, (formObject: IMutationFormObject) => {
                if (formObject.active) formObject.active = false;
            });
        }

        updateValues(selector: UpdateValues, resolveObject: ISearchResult) {
            switch (selector) {
                case UpdateValues.PrerequisiteDefinitions:
                    this.prerequisiteDefinitionIds.value[resolveObject.id] = resolveObject.title;
                    break;
                case UpdateValues.SeeAlso:
                    this.seeAlsoIds.value[resolveObject.id] = resolveObject.title;
                    break;
            }
        }
    }

    class Mutation {
        auth: {
            accessToken: string;
            gPlusId: string;
        };
        // Initialise UMI
        message: string;
        umiType: string;
        title: string;
        titleSynonyms: string[];
        content: string;
        prerequisiteDefinitionIds: string[];
        seeAlsoIds: string[];
        tags: string[];
    }
}