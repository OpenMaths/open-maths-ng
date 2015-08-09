module openmaths {
    'use strict';

    export interface IMutationFormObject {
        active: boolean;
        description: string;
        error?: boolean;
        label: string;
        options?: any;
        remove?: Function;
        update?: Function;
        parseCsv?: Function;
        value: any;
        valueMeta?: any;
        valueParsed?: string;
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
                error: false,
                label: 'Content',
                value: 'C\'mon - Write some LaTeX to see me work! :-)',
                valueParsed: ''
            };

            this.prerequisiteDefinitionIds = {
                active: false,
                description: 'Comma-separated list of valid dependency Titles',
                label: 'Prerequisite Definitions',
                remove: (id: string) => this.removeValues(UpdateValues.PrerequisiteDefinitions, id),
                update: (resolveObject: ISearchResult) => this.updateValues(UpdateValues.PrerequisiteDefinitions, resolveObject),
                value: {}
            };

            this.seeAlsoIds = {
                active: false,
                description: 'Comma-separated list of valid Titles which may be related',
                label: 'See Also',
                remove: (id: string) => this.removeValues(UpdateValues.SeeAlso, id),
                update: (resolveObject: ISearchResult) => this.updateValues(UpdateValues.SeeAlso, resolveObject),
                value: {}
            };

            this.tags = {
                active: false,
                description: 'Comma-separated list of tags to help users find your contribution.',
                label: 'Tags',
                parseCsv: () => this.tags.value = openmaths.CsvParser.parse(this.tags.valueMeta),
                remove: (label: string) => this.removeTag(label),
                value: [],
                valueMeta: ''
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
                options: new openmaths.UmiTypes,
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

        removeValues(selector: UpdateValues, id: string) {
            switch (selector) {
                case UpdateValues.PrerequisiteDefinitions:
                    delete this.prerequisiteDefinitionIds.value[id];
                    break;
                case UpdateValues.SeeAlso:
                    delete this.seeAlsoIds.value[id];
                    break;
            }
        }

        removeTag(label) {
            let newCsvData = openmaths.CsvParser.removeFromList(this.tags.value, label);

            this.tags.value = newCsvData.list;
            this.tags.valueMeta = newCsvData.value;
        }
    }

    export interface ILatexToHtmlPromisePayload {
        auth: IAuth;
        s: string
    }

    export class SubmitMutation {
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

        constructor(public Api: openmaths.Api) {

        }

        latexToHtmlPromise(content: ILatexToHtmlPromisePayload): ng.IHttpPromise<void> {
            return this.Api.post(openmaths.Config.getApiRoutes().latexToHtml, content);
        }
    }
}