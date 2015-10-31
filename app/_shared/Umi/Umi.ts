module openmaths {
    'use strict';

    export interface IUmiDetails {
        id: string;
        title: string;
        type: string;
        uriFriendlyTitle: string;
    }

    export interface IUmi {
        creator: string;
        htmlContent: string;
        id: string;
        latexContent: string;
        latexContentId: string;
        prerequisiteDefinitions: Array<IUmiDetails>;
        seeAlso: Array<IUmiDetails>;
        tags: Array<string>;
        title: string;
        titleSynonyms: Array<string>;
        ts: number;
        umiType: string;
        uriFriendlyTitle: string;
    }

    export class Umi implements IUmi {
        creator:string;
        formal:boolean;
        htmlContent:string;
        id:string;
        latexContent:string;
        latexContentId:string;
        meta:boolean;
        prerequisiteDefinitions:Array<IUmiDetails>;
        seeAlso:Array<IUmiDetails>;
        tags:Array<string>;
        title:string;
        titleSynonyms:Array<string>;
        ts:number;
        umiType:string;
        uriFriendlyTitle:string;

        where:number[];
        empty:boolean;

        constructor(initObject?:IUmi, where?:number[]) {
            this.creator = initObject && initObject.creator ? initObject.creator : undefined;
            this.formal = false;
            this.htmlContent = initObject && initObject.htmlContent ? initObject.htmlContent : undefined;
            this.id = initObject && initObject.id ? initObject.id : undefined;
            this.latexContent = initObject && initObject.latexContent ? initObject.latexContent : undefined;
            this.meta = false;
            this.prerequisiteDefinitions = initObject && initObject.prerequisiteDefinitions ? initObject.prerequisiteDefinitions : undefined;
            this.seeAlso = initObject && initObject.seeAlso ? initObject.seeAlso : undefined;
            this.tags = initObject && initObject.tags ? initObject.tags : undefined;
            this.title = initObject && initObject.title ? initObject.title : undefined;
            this.titleSynonyms = initObject && initObject.titleSynonyms ? initObject.titleSynonyms : undefined;
            this.ts = initObject && initObject.ts ? initObject.ts : undefined;
            this.umiType = initObject && initObject.umiType ? this.parseUmiType(initObject.umiType) : undefined;
            this.uriFriendlyTitle = initObject && initObject.uriFriendlyTitle ? initObject.uriFriendlyTitle : undefined;

            this.where = where ? where : undefined;
            this.empty = this.isEmpty();
        }

        isEmpty() {
            return _.isEmpty(this.id) || _.isEmpty(this.uriFriendlyTitle);
        }

        private parseUmiType(umiTypeRaw:string):string {
            let regexFormal = new RegExp('Formal', 'g'),
                regexMeta = new RegExp('Meta', 'g'),
                matchFormal = umiTypeRaw.match(regexFormal),
                matchMeta = umiTypeRaw.match(regexMeta);

            this.formal = _.isArray(matchFormal) && matchFormal.length > 0;
            this.meta = _.isArray(matchMeta) && matchMeta.length > 0;

            return umiTypeRaw.replace(regexFormal, '').replace(regexMeta, '');
        }

        // @TODO
        // remove after the API has reflected latest Interface updates
        static umiTempFormatter(initObject:any):IUmi {
            let formatted = _.clone(initObject);

            _.forEach(formatted.title, (value:any, key:string) => formatted[key] = value);

            return formatted;
        }
    }

    export interface IUmiType {
        label: string;
        formal?: boolean;
        meta?: boolean;
    }

    export class UmiTypes {
        Axiom:IUmiType = {
            label: 'Axiom',
            formal: true
        };
        AxiomScheme:IUmiType = {
            label: 'Axiom Scheme',
            formal: true
        };
        Conjecture:IUmiType = {
            label: 'Conjecture',
        };
        Corollary:IUmiType = {
            label: 'Corollary',
        };
        Definition:IUmiType = {
            label: 'Definition',
            formal: true,
            meta: true
        };
        Diagram:IUmiType = {
            label: 'Diagram',
        };
        Documentation:IUmiType = {
            label: 'Documentation',
        };
        Example:IUmiType = {
            label: 'Example',
        };
        HistoricalNote:IUmiType = {
            label: 'Historical Note',
        };
        Lemma:IUmiType = {
            label: 'Lemma',
        };
        Notation:IUmiType = {
            label: 'Notation',
            formal: true
        };
        PartialTheorem:IUmiType = {
            label: 'Partial Theorem',
        };
        PhilosophicalJustification:IUmiType = {
            label: 'Philosophical Justification',
        };
        Proof:IUmiType = {
            label: 'Proof',
        };
        Special:IUmiType = {
            label: 'Special',
        };
        Theorem:IUmiType = {
            label: 'Theorem',
        };
    }
}