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
        value: string;
    }

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
                value: ''
            };

            this.prerequisiteDefinitionIds = {
                active: false,
                description: 'Comma-separated list of valid dependency Titles',
                value: ''
            };

            this.seeAlsoIds = {
                active: false,
                description: 'Comma-separated list of valid Titles which may be related',
                value: ''
            };

            this.tags = {
                active: false,
                description: 'Comma-separated list of tags to help users find your contribution.',
                value: ''
            };

            this.title = {
                active: false,
                description: 'Users will be able to search your contribution',
                value: ''
            };

            // Possibly redundant?
            this.titleSynonyms = {
                active: false,
                description: 'Comma-separated list of alternative names.',
                value: ''
            };

            this.umiType = {
                active: false,
                description: 'What category of information?',
                value: ''
            };
        }

        resetActive(): void {
            _.forEach(this, (formObject: IMutationFormObject) => {
                if (formObject.active) formObject.active = false;
            });
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